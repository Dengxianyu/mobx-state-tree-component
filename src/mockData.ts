// from pb type
interface AuthInfo {
  userId: string;
  tenantId: string;
  /** @deprecated 不安全 */
  sessionId?: string;
  deviceId?: string;
  deviceLoginId?: string;
  upgradeEnabled?: boolean;
  isOversea?: boolean; // MG 下线
  isOverseaUser?: boolean; // MG 下线
  isChinaMainlandGeo: boolean; // 当前用户是否为‘CN GEO’
  isFeishuBrand: boolean; // 当前租户是否为飞书品牌
  userGeo: string; // 该用户的geo，'CN' | 'US' | 'SG' |'JP'| 'boe-va' | 'boe-cn';
  tenantGeo?: string; // 该用户的geo，'CN' | 'US' | 'SG' |'JP'| 'boe-va' | 'boe-cn';
  tenantBrand: "feishu" | "lark"; // 该租户的品牌
  serverUnit?: string;
  stayIn15Days?: boolean;
  userEnv?: string; // MG 下线
  /** @deprecated 不安全 */
  sessions?: { [sessingKey: string]: { name: string; value: string } };
  loginTime?: number;
  logoutToken?: string;
}

const authData: AuthInfo = {
  userId: '092374092374034823223',
  tenantId: '9877',
  isChinaMainlandGeo: true,
  isFeishuBrand: true,
  userGeo: 'CN',
  isOversea: false,
  tenantBrand: 'feishu'
}