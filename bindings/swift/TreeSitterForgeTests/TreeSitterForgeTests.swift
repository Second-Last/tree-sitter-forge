import XCTest
import SwiftTreeSitter
import TreeSitterForge

final class TreeSitterForgeTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_forge())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Forge grammar")
    }
}
