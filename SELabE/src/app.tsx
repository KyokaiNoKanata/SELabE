import type {Settings as LayoutSettings} from '@ant-design/pro-layout';
import {PageLoading, SettingDrawer} from '@ant-design/pro-layout';
import type {RunTimeLayoutConfig} from 'umi';
import {history, Link} from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {currentUser as queryCurrentUser} from './services/ant-design-pro/api';
import {BookOutlined, LinkOutlined} from '@ant-design/icons';
import type {RequestConfig} from "@@/plugin-request/request";
import type {RequestOptionsInit} from 'umi-request';
import defaultSettings from '../config/defaultSettings';
import cookie from 'react-cookies'
import type API from './services/ant-design-pro/typings'
import {forEach, parseInt} from "lodash";

const isDev = process.env.NODE_ENV === 'development';
const ignoreAPI = ['/admin-api/system/login', '/admin-api/system/login', '/admin-api/system/sms-login', '/admin-api/system/send-sms-code',]
const loginPath = '/user/login';
const registerPath = '/user/register';



/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrentUser();
    } catch (error) {
      console.log(error);
      history.push(loginPath);
    }
    return undefined;
  };
  if (history.location.pathname !== loginPath && history.location.pathname !== registerPath) {
    const currentUser = await fetchUserInfo();
    console.log(currentUser);
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  if(ignoreAPI.includes(url)) {
    return {
      url: `${url}`,
      options: {...options, interceptors: true },
    };
  }
  const authHeader = { Authorization: 'Bearer ' + cookie.load('USER') };
  return {
    url: `${url}`,
    options: {...options, interceptors: true, headers: authHeader },
  };
};

export const request: RequestConfig = {
  //errorHandler,
  requestInterceptors: [authHeaderInterceptor],
};

const processMenu = (rawMenu: API.MenuDataItem[]) => {
  forEach(rawMenu, (item1)=>{
    if(item1.parentKeys!==null && item1.parentKeys?.length !== 0) {
      forEach(rawMenu, (item2) => {
          if (item2.id == parseInt(item1!.parentKeys![0])) {
            if(!item2.routes){
              item2.routes = [];
            }
            item2.routes.push(item1);
          }
      })
    }
  })
  return rawMenu.filter(item => {
    return item.routes && (!item.parentKeys || item.parentKeys.length == 0);
  });

};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {

    menu: {
      // 每当 initialState?.currentUser?.userId 发生修改时重新执行 request
      params: {
        userId: initialState?.currentUser?.userId
      },
      request: async () => {
        return processMenu(initialState!.currentUser!.menuData!);
      },
    },

    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath && location.pathname !== registerPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

