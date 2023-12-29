import { createAsyncApiAction } from "../../util/asyncApi.utill";

export const fetchAll = createAsyncApiAction("database", "fetchAll", "get");
export const checkConnection = createAsyncApiAction("database", "checkConnection", "get");
export const fetchByName = createAsyncApiAction("database", "fetchByName", "get");
export const create = createAsyncApiAction("database", "create", "post");
export const remove = createAsyncApiAction("database", "delete", "delete");
export const update = createAsyncApiAction("database", "update", "put");
