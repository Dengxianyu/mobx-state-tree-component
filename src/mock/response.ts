export enum GetChatMessagesResponseMessageItemItemType {
  NORMAL_MESSAGE = 1,
  QUASI_MESSAGE = 2,
  EPHEMERAL_MESSAGE = 3,
  MESSAGE_FOLD = 4
}

interface MessageItem {
  itemId: string;
  itemType: GetChatMessagesResponseMessageItemItemType;
}

// MessageContent 的内容是将各个不同消息类型的返回字段平铺进去，这里仅仅简单模拟而已
interface MessageContent {
  text?: string,
  atUsers?: string[],
  url?: {
    previewUrl?: string,
    normalSizeUrl?: string,
    originSizeUrl?: string,
  }
}

export enum MessageType {
  TEXT = 4,
  IMAGE = 5,
}

export interface ChatInfo {
  id: string;
  name: string;
  ownerId: string;
}

export interface basicEntity {
  messages?: {
    [key: string]: {
      id: string;
      type?: MessageType;
      chatId: string;
      senderId?: string;
      content?: MessageContent;
    };
  };
  quasiMessages?: {
    [key: string]: {
      cid: string;
      id: string;
      type?: MessageType;
      chatId: string;
      senderId?: string;
      content?: MessageContent;
    };
  };
  chats?: {
    [key: string]: ChatInfo;
  };
  chatters?: {
    [key: string]: {
      id: string,
      name: string,
      alias: string
    };
  };
}

export interface GetChatMessagesResponse {
  messageItems?: MessageItem[];
  entity?: basicEntity;
}

export interface AuthInfo {
  userId: string;
  tenantId: string;
  deviceId?: string;
  useGeo: boolean;
}

export const authInfo: AuthInfo = {
  userId: '300001',
  tenantId: '1',
  deviceId: '20934823948029842',
  useGeo: true,
}

export const currentChat: ChatInfo = {
  id: '200002',
  name: '当前群',
  ownerId: '300002',
}

export const chatMessagesResponse: GetChatMessagesResponse = {
  messageItems: [
    {
      itemId: '100001',
      itemType: 1
    },
    {
      itemId: '100002',
      itemType: 2
    }
  ],
  entity: {
    messages: {
      '100001': {
        id: '100001',
        type: 4,
        chatId: '200001',
        content: {
          text: '模拟文本消息',
          atUsers: ['300001'],
        },
        senderId: '300001'
      },
      '100002': {
        id: '100002',
        type: 5,
        chatId: '200001',
        content: {
          url: {
            previewUrl: 'https://www.w3school.com.cn/i/eg_mouse.jpg',
            normalSizeUrl: 'https://www.w3school.com.cn/i/eg_mouse.jpg',
            originSizeUrl: 'https://www.w3school.com.cn/i/eg_mouse.jpg',
          },
        },
        senderId: '300002'
      }
    },
    chats: {
      '200001': {
        id: '200001',
        name: '测试群',
        ownerId: '300002',
      }
    },
    chatters: {
      '300001': {
        id: '300001',
        name: '邓先雨',
        alias: '小邓'
      },
      '300002': {
        id: '300002',
        name: '先雨邓',
        alias: '小雨'
      }
    }
  }
}


export enum GetGroupThreadMessagesResponseMessageItemItemType {
  NORMAL_DATA = 1,
  QUASI_DATA = 2
}

interface GroupThreadMessageItem {
  itemId: string;
  itemType: GetGroupThreadMessagesResponseMessageItemItemType;
}
export interface GetGroupThreadMessagesResponse {
  messageItems?: GroupThreadMessageItem[];
  entity?: basicEntity;
}

export const groupThreadMessagesResponse: GetGroupThreadMessagesResponse = {
  messageItems: [
    {
      itemId: '100001',
      itemType: 1
    },
    {
      itemId: '100002',
      itemType: 2
    }
  ],
  entity: {
    messages: {
      '100001': {
        id: '100001',
        type: 4,
        chatId: '200001',
        content: {
          text: '模拟文本消息',
          atUsers: ['300001'],
        },
        senderId: '300001'
      },
      '100002': {
        id: '100002',
        type: 5,
        chatId: '200001',
        content: {
          url: {
            previewUrl: 'https://www.w3school.com.cn/i/eg_mouse.jpg',
            normalSizeUrl: 'https://www.w3school.com.cn/i/eg_mouse.jpg',
            originSizeUrl: 'https://www.w3school.com.cn/i/eg_mouse.jpg',
          },
        },
        senderId: '300002'
      }
    },
    chats: {
      '200001': {
        id: '200001',
        name: '测试群',
        ownerId: '300002',
      }
    },
    chatters: {
      '300001': {
        id: '300001',
        name: '邓先雨',
        alias: '小邓'
      },
      '300002': {
        id: '300002',
        name: '先雨邓',
        alias: '小雨'
      }
    }
  }
}