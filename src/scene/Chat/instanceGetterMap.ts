import { setVMInstanceGetter2Map } from "../../mst-enhance";
import ImgMsgView from "../../view-components/ImgMsg";
import { getImgMsgVMInstance1 } from "../../view-components/ImgMsg/instanceGetter";
import MsgItemView from "../../view-components/MsgItem";
import { getMsgItemVMInstance1 } from "../../view-components/MsgItem/instanceGetter";
import TextMsgView from "../../view-components/TextMsg";
import { getTextMsgVMInstance1 } from "../../view-components/TextMsg/instanceGetter";

const instanceGetterMap = new Map();

setVMInstanceGetter2Map(instanceGetterMap, ImgMsgView, getImgMsgVMInstance1);

setVMInstanceGetter2Map(instanceGetterMap, TextMsgView, getTextMsgVMInstance1);

setVMInstanceGetter2Map(instanceGetterMap, MsgItemView, getMsgItemVMInstance1)

export default instanceGetterMap;

