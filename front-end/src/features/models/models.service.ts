import { createAsyncApiAction } from "../../util/asyncApi.utill";

export const fetchAll = createAsyncApiAction("models", "fetchAll", "get");
export const fetchById = createAsyncApiAction("models", "fetchById", "get");
export const fetchByName = createAsyncApiAction("models", "fetchByName", "get");
export const create = createAsyncApiAction("models", "create", "post");
export const remove = createAsyncApiAction("models", "delete", "delete");
export const update = createAsyncApiAction("models", "update", "put");
