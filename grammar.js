/**
 * @file A more user-friendly Forge, I think.
 * @author Gavin Zhao <gavinz@brown.edu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "forge",

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
        $.pred,
        $.run
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

    identifier: $ => /[A-Za-z]+[0-9A-Za-z]*/,

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

    run: $ => seq(
      optional(seq(
        $.identifier,
        ":"
      )),
      "run",
      "{", 
      repeat($.constraint),
      "}"
    ),

    pred: $ => seq(
      "pred",
      $.identifier,
      optional(seq(
        "[",
        $.args_decl,
        "]"
      )),
      "{", 
      repeat($.constraint),
      "}"
    ),

    _arg_decl_single: $ => seq(
      repeat(seq($.identifier, ",")), $.identifier, ":", $.type
    ),

    args_decl: $ => seq(
      repeat(seq($._arg_decl_single, ",")),
      $._arg_decl_single
    ),

    constraint: $ => choice(
      $.formula,
      seq(
        choice("all", "some"),
        optional(choice("disj")),
        //repeat(seq($._constraint_param, ",")),
        //$._constraint_param,
        $.args_decl,
        "|",
        $.formula
        //choice(
        //  $.formula,
        //  seq("{", repeat($.formula), "}")
        //)
      )
    ),

    expr: $ => choice(
      $._expr,
      seq(
        $.expr,
        token.immediate("["),
        repeat(seq($.expr, ",")),
        $.expr,
        "]"
      ),
      prec.left(5, seq($.expr, token.immediate("."), $.expr))
    ),

    _expr: $ => choice($.identifier, $.number),

    formula: $ => choice(
      $._formula,
      seq("{", repeat($.formula), "}"),
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
      seq($.expr, "=", $.expr),
      seq($.expr, "!=", $.expr)
    ),
  }
});
