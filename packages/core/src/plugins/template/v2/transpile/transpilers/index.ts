import { reducePlugins } from "../utils";

import Comment from "./comment/comment";
import Element from "./element";
import Interpolation from "./interpolation";
import Root from "./root";
import Text from "./text";

export default reducePlugins([Element, Comment, Interpolation, Root, Text]);
