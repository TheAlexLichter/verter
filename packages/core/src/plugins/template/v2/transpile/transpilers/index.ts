import { reducePlugins } from "../utils";

import Comment from "./comment/comment";
import Element from "./element";
// import comments from "./for";
// import comments from "./if";
import Interpolation from "./interpolation";
import Root from "./root";
// import comments from "./simple_expression";
import Text from "./text";

export default reducePlugins([Element, Comment, Interpolation, Root, Text]);
