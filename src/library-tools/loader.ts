import * as library from "./bundle.json";
import { parseItem } from "./parser";
import { ItemDefinition, TransactionItem } from "./types";

interface ILibrary {
    descriptions: ItemDefinition[];
}

function loadLibrary() {
    const libraryItems: ILibrary = library as ILibrary;

    const byContractMethod = new Map<string, TransactionItem>();
    const byContract = new Map<string, TransactionItem>();
    const byMethod = new Map<string, TransactionItem>();
    const byBaseContractMethod = new Map<string, TransactionItem>();
    const byBaseContract = new Map<string, TransactionItem>();

    libraryItems.descriptions.forEach((item) => {
        const parsedItem = parseItem(item);

        if (item.filter_by.contract !== undefined) {
            if (item.filter_by.method !== undefined) {
                byContractMethod.set(
                    `${item.filter_by.contract}.${item.filter_by.method}`,
                    parsedItem
                );
            } else {
                byContract.set(item.filter_by.contract, parsedItem);
            }
        } else if (item.filter_by.base_contract !== undefined) {
            if (item.filter_by.method !== undefined) {
                byBaseContractMethod.set(
                    `${item.filter_by.base_contract}.${item.filter_by.method}`,
                    parsedItem
                );
            } else {
                byBaseContract.set(item.filter_by.base_contract, parsedItem);
            }
        } else if (item.filter_by.method !== undefined) {
            byMethod.set(item.filter_by.method, parsedItem);
        } else {
            throw new Error("Empty filter_by");
        }
    });

    return {
        byContractMethod,
        byContract,
        byMethod,
        byBaseContractMethod,
        byBaseContract,
    };
}

export const content = loadLibrary();
