import { createAsyncApiAction } from "../../util/asyncApi.utill";

export const fetchAll = createAsyncApiAction("todo", "fetchAll", "get");
export const create = createAsyncApiAction("todo", "create", "post");
export const remove = createAsyncApiAction("todo", "delete", "delete");
export const update = createAsyncApiAction("todo", "update", "put");