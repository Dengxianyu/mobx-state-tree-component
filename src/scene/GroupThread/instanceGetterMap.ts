import { setVMInstanceGetter2Map } from "../../mst-enhance";
import ImgMsgView from "../../view-components/ImgMsg";
import { getImgMsgVMInstance2 } from "../../view-components/ImgMsg/instanceGetter";
import MsgItemView from "../../view-components/MsgItem";
import { getMsgItemVMInstance2 } from "../../view-components/MsgItem/instanceGetter";
import TextMsgView from "../../view-components/TextMsg";
import { getTextMsgVMInstance2 } from "../../view-components/TextMsg/instanceGetter";

const instanceGetterMap = new Map();

setVMInstanceGetter2Map(instanceGetterMap, ImgMsgView, getImgMsgVMInstance2);

setVMInstanceGetter2Map(instanceGetterMap, TextMsgView, getTextMsgVMInstance2);

setVMInstanceGetter2Map(instanceGetterMap, MsgItemView, getMsgItemVMInstance2)

export default instanceGetterMap;

