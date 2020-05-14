import * as ts from "typescript";

const TTRANSFORMER_FN_NAME = "ttransformer";

function getVisitor(context: ts.TransformationContext, typeChecker: ts.TypeChecker): ts.Visitor {
  const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
    // =======================
    // === START TRANSFORM ===

    if (ts.isCallExpression(node)) {
      const expressionSymbol = typeChecker.getSymbolAtLocation(node.expression);
      const expressionName = expressionSymbol ? expressionSymbol.name : "";

      if (expressionName === TTRANSFORMER_FN_NAME) {
        const argumentSymbol = typeChecker.getSymbolAtLocation(node.arguments[0]);

        if (argumentSymbol) {
          /**
           * Unfortunately here it is not possible to get the symbol of the actual class. That's because the class is imported.
           * The symbol is always an ImportSpecifier and not a ClassDeclaration.
           *
           * Therefore I would have to follow the import or I would have to store the class name and traverse the ast again with another transformer.
           *
           * As you can see in the console...
           *
           * /ttransformer-playground/ttransformer.ts
           * /ttransformer-playground/test.component.ts
           * /ttransformer-playground/source.ts
           *
           * ... the actual class definition (test.component.ts) is visited before the source file. Therefore I do not know at this moment that the class has to be adjusted.
           * Therefore the class definition has to be revisited somehow. (As I said; maybe following the module import or traverse the AST again.)
           *
           * But ya; that's actually my question: After I find the ttransformer function with the typescript transformer how can I adjust the first argument (the class).
           */
        }
      }
    }

    // === END TRANSFORM ===
    // ======================

    return ts.visitEachChild(node, visitor, context);
  };

  return visitor;
}

function getTransformerFactory(typeChecker: ts.TypeChecker): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext): ((sourceFile: ts.SourceFile) => ts.SourceFile) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      console.log(sourceFile.fileName);
      return ts.visitNode(sourceFile, getVisitor(context, typeChecker));
    };
  };
}

const transformerProgram = (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  console.log("TRANSFORMER_PROGRAM");
  const typeChecker = program.getTypeChecker();
  return getTransformerFactory(typeChecker);
};

export default transformerProgram;
