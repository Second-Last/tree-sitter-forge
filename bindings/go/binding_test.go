package tree_sitter_forge_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_forge "github.com/second-last/tree-sitter-forge/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_forge.Language())
	if language == nil {
		t.Errorf("Error loading Forge grammar")
	}
}
