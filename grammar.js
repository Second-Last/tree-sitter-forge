/**
 * @file A more user-friendly Forge, I think.
 * @author Gavin Zhao <gavinz@brown.edu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "froglet",

  extras: $ => [
    /\s|\\\r?\n/,
    $.comment,
  ],

  word: $ => $.identifier,

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => seq(
      $.lang,
      repeat(choice(
        $.sig,
        $.pred
      ))
    ),

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: _ => token(choice(
      seq("--", /(\\+(.|\r?\n)|[^\\\n])*/),
      seq("//", /(\\+(.|\r?\n)|[^\\\n])*/),
      seq(
        "/*",
        /[^*]*\*+([^/*][^*]*\*+)*/,
        "/",
      ),
    )),

    identifier: $ => /[A-Za-z]+/,

    type_identifier: $ => $.identifier,

    number: $ => /\d+/,

    lang: $ => seq("#lang", /([A-Za-z]+\/)+[A-Za-z]+/),

    multiplicity: $ => choice(
      "one",
      "lone",
      "pfunc",
      "func"
    ),

    type: $ => seq(
      repeat(seq($._type, "->")),
      $._type
    ),

    _type: $ => choice("Int", $.type_identifier),

    field: $ => seq(
      field("name", $.identifier),
      ":",
      $.multiplicity,
      $.type
    ),

    sig: $ => seq(
      optional(choice("one", "abstract", "lone")),
      "sig",
      repeat(seq($.type_identifier, ",")),
      $.type_identifier,
      optional(seq(
        "extends",
        $.type_identifier
      )),
      "{", 
      optional(seq(repeat(seq($.field, ",")), $.field)),
      "}"
    ),

    pred: $ => seq(
      "pred",
      $.identifier,
      "{", 
      repeat($.constraint),
      "}"
    ),

    _constraint_param: $ => 
      seq(repeat(seq($.identifier, ",")), $.identifier, ":", $.type),

    constraint: $ => seq(
      choice("all", "some"),
      optional(choice("disj")),
      repeat(seq($._constraint_param, ",")),
      $._constraint_param,
      "|",
      choice(
        $.formula,
        seq("{", repeat($.formula), "}")
      )
    ),

    expr: $ => choice(
      $._expr,
      prec.left(5, seq($.expr, token.immediate("."), $.expr))
    ),

    _expr: $ => $.identifier,

    formula: $ => choice(
      $._formula,
      prec.left(5, seq("not", $.formula)),
      prec.left(4, seq($.formula, choice("and", "&&"), $.formula)),
      prec.left(3, seq($.formula, choice("or", "||"), $.formula)),
      prec.left(2, seq(
        $.formula,
        choice("implies", "=>"),
        $.formula,
        optional(seq("else", $._formula))
      )),
      prec.left(1, seq(
        $.formula,
        choice("iff", "<=>"),
        $.formula
      ))
    ),

    _formula: $ => choice(
      $.expr,
      seq("no", $.expr),
      seq("one", $.expr),
      seq("lone", $.expr),
      seq("some", $.expr),
      seq($.expr, "=", $.expr)
    ),
  }
});
