package tree_sitter_froglet_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_froglet "github.com/second-last/tree-sitter-froglet/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_froglet.Language())
	if language == nil {
		t.Errorf("Error loading Froglet grammar")
	}
}
