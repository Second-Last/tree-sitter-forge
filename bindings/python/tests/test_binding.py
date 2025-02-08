from unittest import TestCase

import tree_sitter
import tree_sitter_forge


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_forge.language())
        except Exception:
            self.fail("Error loading Forge grammar")
