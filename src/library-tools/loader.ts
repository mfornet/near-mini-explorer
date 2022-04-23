import * as library from "./bundle.json";
import { parseItem } from "./parser";
import { ItemDefinition, TransactionItem } from "./types";

function loadLibrary(): TransactionItem {
    return parseItem(library as ItemDefinition);
}

export const content = loadLibrary();
