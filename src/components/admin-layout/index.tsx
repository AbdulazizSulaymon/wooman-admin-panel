import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { join } from '@fireflysemantics/join';
import { useUserMe } from '@hooks/use-user-me';
import { projectName } from '@pages/_app';
import { useApi } from '@src/api';
import { useStore } from '@src/stores/stores';
import { Props } from '@utils/types';
import { useFullscreen } from 'ahooks';
import { Button, Drawer, Dropdown, Layout, Menu, MenuProps, Typography, theme } from 'antd';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AiTwotoneSetting } from 'react-icons/ai';
import { BsEvStationFill } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { HiOutlineLogout } from 'react-icons/hi';
import { HiHome } from 'react-icons/hi';
import { ImTruck, ImUserTie } from 'react-icons/im';
import { MdAccountTree, MdFullscreen, MdFullscreenExit, MdMonitor } from 'react-icons/md';
import { RiCustomerServiceFill } from 'react-icons/ri';

const { Text } = Typography;

const { Header, Sider, Content } = Layout;
const { useToken } = theme;

const menuItems = [
  {
    key: 'home',
    icon: <HiHome />,
    label: 'Home',
    children: [
      {
        key: '/',
        label: 'Home',
      },
    ],
  },
  {
    key: 'user-management',
    icon: <ImUserTie />,
    label: 'User Management',
    children: [
      {
        key: 'users',
        label: 'Users',
      },
      {
        key: 'roles',
        label: 'Roles',
      },
      {
        key: 'departments',
        label: 'Departments',
      },
      {
        key: 'positions',
        label: 'Positions',
      },
    ],
  },
  {
    key: 'customer-service',
    icon: <RiCustomerServiceFill />,
    label: 'Customer Service',
    children: [
      {
        key: 'customers',
        label: 'Customers',
      },
      {
        key: 'accounts',
        label: 'Company Accounts',
      },
      {
        key: 'account-cards',
        label: 'Company Account Cards',
      },
      {
        key: 'bank-accounts',
        label: 'Bank Accounts',
      },
      {
        key: 'bank-cards',
        label: 'Bank Cards',
      },
    ],
  },
  {
    key: 'accounting',
    icon: <MdAccountTree />,
    label: 'Accounting',
    children: [
      {
        key: 'efs-upload-list',
        label: 'EFS Upload List',
      },
      {
        key: 'discount-management',
        label: 'Discount Management',
      },
      {
        key: 'invoicing',
        label: 'Invoicing',
      },
      {
        key: 'payment-list',
        label: 'Payment List',
      },
    ],
  },
  {
    key: 'station-management',
    icon: <BsEvStationFill />,
    label: 'Station Management',
    children: [
      {
        key: 'station-chains',
        label: 'Station Chains',
      },
      {
        key: 'stations',
        label: 'Stations',
      },
    ],
  },
  {
    key: 'settings',
    icon: <AiTwotoneSetting />,
    label: 'Settings',
    children: [
      {
        key: 'organizations',
        label: 'Organizations',
      },
      {
        key: 'efs-accounts',
        label: 'EFS Accounts',
      },
    ],
  },
];

const AdminLayout = observer(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const store = useStore();
  const [collapsed, setCollapsed] = [store.layoutStore.collapsed, store.layoutStore.setCollapsed];
  const ref = useRef(null);
  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen }] = useFullscreen(ref);
  const title = router.route.slice(router.route.lastIndexOf('/') + 1);
  const subKey = router.route.slice(router.route.indexOf('/') + 1, router.route.lastIndexOf('/'));
  const api = useApi();
  const userData = useUserMe();

  useEffect(() => {
    if (!api.checkToken()) router.push('/login');
  }, []);

  const profileItems: MenuProps['items'] =
    //   useMemo(
    // () =>
    [
      {
        type: 'divider',
      },
      {
        label: (
          <p className={'m-0'} onClick={() => api.logOut()}>
            <HiOutlineLogout /> Log out
          </p>
        ),
        key: '3',
      },
    ];
  //   [api],
  // );
  const { token } = useToken();

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle = {
    boxShadow: 'none',
  };

  const Side = ({ onSelect, ...props }: Props & { onSelect?: Function }) => {
    return (
      <Sider trigger={null} collapsible collapsed={collapsed} {...props}>
        <div className="logo hidden md:block">
          <Text className={'font-bold block  text-white text-center text-2xl p-3 whitespace-nowrap'}>
            {(collapsed && 'C') || projectName}
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[title]}
          defaultOpenKeys={!store.layoutStore.collapsed ? [subKey] : []}
          items={menuItems}
          onSelect={(obj) => {
            router.push(join('/', obj.keyPath[1], obj.keyPath[0]));
            onSelect && onSelect();
          }}
        />
      </Sider>
    );
  };

  return (
    <Layout ref={ref} className={'h-[100vh]'} css={css``}>
      <Drawer
        title={projectName}
        placement="left"
        onClose={() => setCollapsed(true)}
        open={!collapsed}
        rootClassName={'layout-drawer'}
        // style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)', backdropFilter: 'blur(10px)' }}
        style={{ backgroundColor: '#001529' }}
        css={css`
          .ant-drawer-title,
          .ant-drawer-close {
            color: white !important;
          }
        `}
      >
        <Side
          onSelect={() => setCollapsed(true)}
          css={css`
            overflow-y: auto;
            &:not(.ant-layout-sider-collapsed) {
              flex: none !important;
              min-width: 240px !important;
              max-width: 100% !important;
              width: 100% !important;
            }
          `}
        />
      </Drawer>
      <Side
        css={css`
          overflow-y: auto;
          &:not(.ant-layout-sider-collapsed) {
            flex: none !important;
            min-width: 240px !important;
            max-width: 300px !important;
            width: auto !important;
          }
          @media (max-width: 768px) {
            & {
              display: none !important;
            }
          }
        `}
      />
      <Layout className="site-layout flex flex-column h-[100vh]">
        <Header className={'drop-shadow-xl bg-white flex items-center justify-between px-8'}>
          <div className={'flex items-center justify-center'}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
            <Text className={'font-bold text-xl capitalize ml-3'}>{title}</Text>
          </div>
          <div className={'flex items-center justify-center'}>
            <Button onClick={toggleFullscreen} className={'mr-2'}>
              {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
            </Button>

            <Dropdown
              menu={{ items: profileItems }}
              trigger={['click']}
              dropdownRender={(menu) => (
                <div style={contentStyle}>
                  <div className={'py-2 px-3'}>
                    <p className={'m-0'}>Abdulaziz Ochilov</p>
                  </div>
                  {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
                  {/*<Divider style={{ margin: 0 }} />*/}
                  {/*<Space style={{ padding: 8 }}>*/}
                  {/*  <Button type="primary">Click me!</Button>*/}
                  {/*</Space>*/}
                </div>
              )}
            >
              <Button>
                <CgProfile />
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 280,
            flex: 1,
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
});

export default AdminLayout;
