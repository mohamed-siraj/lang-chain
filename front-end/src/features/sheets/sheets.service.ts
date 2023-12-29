import { createAsyncApiAction } from "../../util/asyncApi.utill";

export const fetchAll = createAsyncApiAction("sheets", "fetchAll", "get");
export const create = createAsyncApiAction("sheets", "create", "post");
export const remove = createAsyncApiAction("sheets", "delete", "delete");
export const update = createAsyncApiAction("sheets", "update", "put");