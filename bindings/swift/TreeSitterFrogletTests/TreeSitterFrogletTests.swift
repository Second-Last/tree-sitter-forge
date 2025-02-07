import XCTest
import SwiftTreeSitter
import TreeSitterFroglet

final class TreeSitterFrogletTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_froglet())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Froglet grammar")
    }
}
