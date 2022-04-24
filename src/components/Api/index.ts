import { Token } from "./NEAR/Token";
import { Contract } from "./NEAR/Contract";
import { Debug } from "./NEAR/Debug";
import { Amount } from "./Nep141/Amount";
import { Name } from "./Nep141/Name";
import { Symbol } from "./Nep141/Symbol";

export { Token as NearToken } from "./NEAR/Token";
export { Contract } from "./NEAR/Contract";
export { Debug } from "./NEAR/Debug";
export { Amount } from "./Nep141/Amount";
export { Name } from "./Nep141/Name";
export { Symbol } from "./Nep141/Symbol";

// TODO: Fill components using reflection (or something similar)
export const Components = new Map<string, (props: any) => JSX.Element>();

Components.set("NEAR/Token", Token);
Components.set("NEAR/Contract", Contract);
Components.set("NEAR/Debug", Debug);
Components.set("Nep141/Amount", Amount);
Components.set("Nep141/Symbol", Symbol);
Components.set("Nep141/Name", Name);
