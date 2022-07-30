import { JWTTokenModel } from '@delon/auth';
import { User as NzUser } from '@delon/theme';

//#region OSharp Models
export interface AjaxResult {
  type: AjaxResultType;
  content?: string;
  data?: any;
}
export enum AjaxResultType {
  Info = 203,
  Success = 200,
  Error = 500,
  UnAuth = 401,
  Forbidden = 403,
  NoFound = 404,
  Locked = 423
}

/**  分页数据 */
export interface PageData<T> {
  /**  数据行 */
  rows: T[];
  /**  总数据量 */
  total: number;
}
export interface ListNode {
  id: number;
  text: string;
}

/** 查询条件 */
export class FilterRule {
  /**
   * 实例化一个条件信息
   *
   * @param field 字段名
   * @param value 属性值
   * @param operate 对比操作
   */
  constructor(field: string, value: string, operate: FilterOperate = FilterOperate.Equal) {}
  [key: string]: any;
}
/**  查询条件组 */
export class FilterGroup {
  /** 条件集合 */
  rules: FilterRule[] = [];
  /** 条件间操作 */
  operate: FilterOperate = FilterOperate.And;
  /** 条件组集合 */
  groups: FilterGroup[] = [];
  level = 1;

  static Init(group: FilterGroup) {
    if (!group.level) {
      group.level = 1;
    }
    group.groups.forEach(subGroup => {
      subGroup.level = group.level + 1;
      FilterGroup.Init(subGroup);
    });
  }
}

/** 比较操作枚举 */
export enum FilterOperate {
  And = 1,
  Or = 2,
  Equal = 3,
  NotEqual = 4,
  Less = 5,
  LessOrEqual = 6,
  Greater = 7,
  GreaterOrEqual = 8,
  StartsWith = 9,
  EndsWith = 10,
  Contains = 11,
  NotContains = 12
}
export class FilterOperateEntry {
  display: string;

  constructor(operate: FilterOperate) {
    switch (operate) {
      case FilterOperate.And:
        this.display = '并且';
        break;
      case FilterOperate.Or:
        this.display = '或者';
        break;
      case FilterOperate.Equal:
        this.display = '等于';
        break;
      case FilterOperate.NotEqual:
        this.display = '不等于';
        break;
      case FilterOperate.Less:
        this.display = '小于';
        break;
      case FilterOperate.LessOrEqual:
        this.display = '小于等于';
        break;
      case FilterOperate.Greater:
        this.display = '大于';
        break;
      case FilterOperate.GreaterOrEqual:
        this.display = '大于等于';
        break;
      case FilterOperate.StartsWith:
        this.display = '开始于';
        break;
      case FilterOperate.EndsWith:
        this.display = '结束于';
        break;
      case FilterOperate.Contains:
        this.display = '包含';
        break;
      case FilterOperate.NotContains:
        this.display = '不包含';
        break;
      default:
        this.display = '未知操作';
        break;
    }
    this.display = `${operate as number}.${this.display}`;
  }
}
/**  分页请求 */
export class PageRequest {
  /**  分页条件信息 */
  pageCondition: PageCondition = new PageCondition();
  /**  查询条件组 */
  flterGroup: FilterGroup = new FilterGroup();
}
/**  分页条件 */
export class PageCondition {
  /**  页序 */
  pageIndex = 1;
  /**  分页大小 */
  pageSize = 20;
  /**  排序条件集合 */
  sortConditions: SortCondition[] = [];
}
export class SortCondition {
  sortField?: string;
  listSortDirection: ListSortDirection = ListSortDirection.Ascending;
}
export enum ListSortDirection {
  Ascending,
  Descending
}

/**  实体属性信息 */
export class EntityProperty {
  name?: string;
  display?: string;
  typeName?: string;
  isUserFlag?: boolean;
  valueRange?: any[];
}

/**
 * 验证码类
 */
export class VerifyCode {
  /**  验证码后台编号 */
  id!: string;
  /**  验证码图片的Base64格式 */
  image = 'data:image/png;base64,null';
  /**  输入的验证码 */
  code!: string;
}

//#endregion

//#region Identity Model
export class LoginDto {
  type!: number;
  account!: string;
  password?: string;
  verifyCode?: string;
  verifyCodeId?: string;
  remember = true;
  returnUrl?: string;
}
export class TokenDto {
  grantType!: 'password' | 'refresh_token';
  account?: string;
  password?: string;
  verifyCode?: string;
  refreshToken?: string;
}
export class JsonWebToken {
  accessToken!: string;
  refreshToken!: string;
  refreshUctExpires!: number;
}
export class LocalTokenModel {
  accessToken!: JWTTokenModel;
  refreshToken!: string;
}
export class RegisterDto {
  email?: string;
  password?: string;
  confirmPassword?: string;
  verifyCode?: string;
  verifyCodeId?: string;
}
export class ChangePasswordDto {
  userId?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
export class ConfirmEmailDto {
  userId!: string;
  code!: string;
}
export class SendMailDto {
  email!: string;
  verifyCode?: string;
  verifyCodeId?: string;
}
export class ResetPasswordDto {
  userId!: string;
  token!: string;
  newPassword!: string;
  confirmPassword!: string;
}
export class ProfileEditDto {
  id!: number;
  userName!: string;
  nickName?: string;
  email?: string;
  headImg?: string;
}
export class UserLoginInfoEx {
  constructor(key: string) {
    this.providerKey = key;
  }
  providerKey!: string;
  email?: string;
  password?: string;
}
/**  权限配置信息 */
export class AuthConfig {
  constructor(
    /**  当前模块的位置，即上级模块的路径，如Root,Root.Admin,Root.Admin.Identity */
    public position: string,
    /**  要权限控制的功能名称，可以是节点名称或全路径 */
    public funcs: string[]
  ) {}
}

/**  用户信息 */
export class User implements NzUser {
  constructor() {
    this.roles = [];
  }
  id?: number;
  name?: string;
  avatar?: string;
  email?: string;
  [key: string]: any;
  nickName?: string;
  roles?: string[];
  isAdmin?: boolean;
}

//#endregion

//#region system

/**
 * 系统初始化安装DTO
 */
export class InstallDto {
  siteName!: string;
  siteDescription!: string;
  adminUserName!: string;
  adminPassword!: string;
  confirmPassword!: string;
  adminEmail!: string;
  adminNickName!: string;
}

//#endregion

//#region delon

export class AdResult {
  /**
   * 是否显示结果框
   */
  show = false;
  /**  结果类型，可选为： 'success' | 'error' | 'minus-circle-o' */
  type!: 'success' | 'error' | 'minus-circle-o';
  /**  结果标题 */
  title?: string;
  /**  结果描述 */
  description?: string;
}

//#endregion
