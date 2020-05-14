import { ttransformer } from "./ttransformer";
import { TestComponent } from "./test.component";

/**
 * The typescript-transformer should find this line because it is looking for "ttransformer".
 * The first argument - "TestComponent" - of the ttransformer function is the class which should be adjusted.
 * What of the class definition gets adjusted with the typescript transformer does not matter.
 */
ttransformer(TestComponent);
