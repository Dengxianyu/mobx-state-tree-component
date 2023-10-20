import { useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Chat from './scene/Chat';
import { authInfo, chatMessagesResponse, currentChat, groupThreadMessagesResponse } from './mock/response';
import GroupThread from './scene/GroupThread';

const items: MenuProps['items'] = [
  {
    label: '场景 1',
    key: 'chat',
    icon: <AppstoreOutlined />,
  },
  {
    label: '场景 2',
    key: 'group-thread',
    icon: <AppstoreOutlined />,
  },
]

function App() {
  
  const [current, setCurrent] = useState('chat');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      { current === 'chat' && <Chat chatMessagesResp={chatMessagesResponse} authInfo={authInfo} currentChatInfo={currentChat}/>}
      { current === 'group-thread' && <GroupThread GroupThreadMessagesResp={groupThreadMessagesResponse} authInfo={authInfo} currentChatInfo={currentChat} />}
    </>
  )
}

// function Test() {
//   console.log('render')
//   return (
//     <div>1111</div>
//   )
// }

export default App;
