/*
Navicat MySQL Data Transfer

Source Server         : msg
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : account

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2020-12-25 17:33:56
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ac_admin
-- ----------------------------
DROP TABLE IF EXISTS `ac_admin`;
CREATE TABLE `ac_admin` (
  `admin_id` int(4) NOT NULL AUTO_INCREMENT COMMENT '管理员id',
  `admin_name` varchar(20) DEFAULT NULL COMMENT '管理员账号名',
  `admin_password` varchar(35) DEFAULT NULL COMMENT '管理员账号密码',
  `admin_role_id` int(4) DEFAULT NULL COMMENT '管理员角色id',
  `admin_last_entertime` int(11) DEFAULT NULL COMMENT '管理员账号最后一次登录账号',
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ac_admin
-- ----------------------------
INSERT INTO `ac_admin` VALUES ('1', 'admin', 'e10adc3949ba59abbe56e057f20f883e', '1', '2147483647');
INSERT INTO `ac_admin` VALUES ('3', 'admin2', 'e10adc3949ba59abbe56e057f20f883e', '3', '2147483647');

-- ----------------------------
-- Table structure for ac_money
-- ----------------------------
DROP TABLE IF EXISTS `ac_money`;
CREATE TABLE `ac_money` (
  `m_id` int(4) NOT NULL AUTO_INCREMENT COMMENT '用户资金情况表的id',
  `u_id` int(4) DEFAULT NULL COMMENT '用户id',
  `m_expenses` decimal(8,2) DEFAULT NULL COMMENT '用户的支出金额',
  `m_income` decimal(8,2) DEFAULT NULL COMMENT '用户的收入金额',
  `m_type_id` int(4) DEFAULT NULL COMMENT '金额用途类型的id',
  `m_time` int(11) DEFAULT NULL COMMENT '用户消费或者支出的时间',
  `m_remarkes` text DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`m_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ac_money
-- ----------------------------

-- ----------------------------
-- Table structure for ac_plan
-- ----------------------------
DROP TABLE IF EXISTS `ac_plan`;
CREATE TABLE `ac_plan` (
  `p_id` int(4) NOT NULL AUTO_INCREMENT COMMENT '用户规划表的id',
  `u_id` int(11) DEFAULT NULL COMMENT '用户名表的id',
  `p_target_money` decimal(6,2) DEFAULT 100.00 COMMENT '用户的每天预留存款',
  `p_push_time` int(11) DEFAULT NULL COMMENT '用户制定计划的时间',
  PRIMARY KEY (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ac_plan
-- ----------------------------

-- ----------------------------
-- Table structure for ac_power
-- ----------------------------
DROP TABLE IF EXISTS `ac_power`;
CREATE TABLE `ac_power` (
  `power_id` int(4) NOT NULL AUTO_INCREMENT COMMENT '权限id',
  `power_name` varchar(20) DEFAULT NULL COMMENT '权限名称',
  `power_c_a` varchar(20) DEFAULT '' COMMENT '权限路由（C/A）',
  `power_flag` tinyint(1) DEFAULT 1 COMMENT '权限名称是否显示在页面(1:显示   0:不显示)',
  `power_parent_id` tinyint(4) DEFAULT 0 COMMENT '所属权限级数(0:顶级 1:一级 2:二级)',
  PRIMARY KEY (`power_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ac_power
-- ----------------------------
INSERT INTO `ac_power` VALUES ('1', '用户管理', ' ', '1', '0');
INSERT INTO `ac_power` VALUES ('2', '用户列表', '/userapp/list', '1', '1');
INSERT INTO `ac_power` VALUES ('6', '系统管理', '', '1', '0');
INSERT INTO `ac_power` VALUES ('7', '角色管理', '/role/role', '1', '6');
INSERT INTO `ac_power` VALUES ('8', '权限管理', '/power/power', '1', '6');
INSERT INTO `ac_power` VALUES ('16', '删除头像', '/userapp/delavatar', '0', '2');
INSERT INTO `ac_power` VALUES ('17', '屏蔽用户', '/1/1', '0', '2');
INSERT INTO `ac_power` VALUES ('18', '删除用户', '/userapp/delete', '0', '2');
INSERT INTO `ac_power` VALUES ('22', '管理员管理', '/1/1', '0', '0');
INSERT INTO `ac_power` VALUES ('23', '查看管理员信息', '/index/msg', '0', '22');
INSERT INTO `ac_power` VALUES ('24', '添加管理员', '/index/add', '0', '22');
INSERT INTO `ac_power` VALUES ('25', '修改管理员密码', '/index/msg', '0', '22');
INSERT INTO `ac_power` VALUES ('26', '添加角色', '/role/addrole', '0', '7');
INSERT INTO `ac_power` VALUES ('27', '修改角色', '/role/changerole', '0', '7');
INSERT INTO `ac_power` VALUES ('28', '删除角色', '/role/delete', '0', '7');
INSERT INTO `ac_power` VALUES ('29', '增加权限', '/power/addpower', '0', '8');
INSERT INTO `ac_power` VALUES ('30', '删除权限', '/power/delete', '0', '8');
INSERT INTO `ac_power` VALUES ('31', '修改权限', '/power/changepower', '0', '8');

-- ----------------------------
-- Table structure for ac_role
-- ----------------------------
DROP TABLE IF EXISTS `ac_role`;
CREATE TABLE `ac_role` (
  `role_id` int(4) NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `role_name` varchar(20) DEFAULT NULL COMMENT '角色名称',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ac_role
-- ----------------------------
INSERT INTO `ac_role` VALUES ('1', '超级管理员');
INSERT INTO `ac_role` VALUES ('3', '客服经理');

-- ----------------------------
-- Table structure for ac_role_to_power
-- ----------------------------
DROP TABLE IF EXISTS `ac_role_to_power`;
CREATE TABLE `ac_role_to_power` (
  `zid` int(4) NOT NULL AUTO_INCREMENT COMMENT '角色与权限中转表id',
  `role_id` int(4) DEFAULT NULL COMMENT '角色id',
  `power_id` int(4) DEFAULT NULL COMMENT '权限id',
  PRIMARY KEY (`zid`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ac_role_to_power
-- ----------------------------
INSERT INTO `ac_role_to_power` VALUES ('22', '1', '1');
INSERT INTO `ac_role_to_power` VALUES ('23', '1', '17');
INSERT INTO `ac_role_to_power` VALUES ('24', '1', '6');
INSERT INTO `ac_role_to_power` VALUES ('25', '1', '7');
INSERT INTO `ac_role_to_power` VALUES ('26', '1', '2');
INSERT INTO `ac_role_to_power` VALUES ('27', '1', '18');
INSERT INTO `ac_role_to_power` VALUES ('28', '1', '16');
INSERT INTO `ac_role_to_power` VALUES ('29', '1', '24');
INSERT INTO `ac_role_to_power` VALUES ('30', '1', '28');
INSERT INTO `ac_role_to_power` VALUES ('31', '1', '31');
INSERT INTO `ac_role_to_power` VALUES ('32', '1', '25');
INSERT INTO `ac_role_to_power` VALUES ('33', '1', '26');
INSERT INTO `ac_role_to_power` VALUES ('34', '1', '22');
INSERT INTO `ac_role_to_power` VALUES ('35', '1', '23');
INSERT INTO `ac_role_to_power` VALUES ('36', '1', '30');
INSERT INTO `ac_role_to_power` VALUES ('37', '1', '29');
INSERT INTO `ac_role_to_power` VALUES ('38', '1', '27');
INSERT INTO `ac_role_to_power` VALUES ('39', '1', '8');
INSERT INTO `ac_role_to_power` VALUES ('40', '3', '1');
INSERT INTO `ac_role_to_power` VALUES ('41', '3', '17');
INSERT INTO `ac_role_to_power` VALUES ('42', '3', '16');
INSERT INTO `ac_role_to_power` VALUES ('43', '3', '18');
INSERT INTO `ac_role_to_power` VALUES ('44', '3', '22');
INSERT INTO `ac_role_to_power` VALUES ('45', '3', '25');
INSERT INTO `ac_role_to_power` VALUES ('46', '3', '23');
INSERT INTO `ac_role_to_power` VALUES ('47', '3', '2');

-- ----------------------------
-- Table structure for ac_type
-- ----------------------------
DROP TABLE IF EXISTS `ac_type`;
CREATE TABLE `ac_type` (
  `t_id` int(4) NOT NULL AUTO_INCREMENT COMMENT '用户支出或消费金额用途类型的id',
  `t_name` varchar(50) DEFAULT NULL COMMENT '用途的类型名字',
  `t_ordre` tinyint(3) DEFAULT NULL COMMENT '用途分类显示顺序',
  PRIMARY KEY (`t_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ac_type
-- ----------------------------

-- ----------------------------
-- Table structure for ac_user
-- ----------------------------
DROP TABLE IF EXISTS `ac_user`;
CREATE TABLE `ac_user` (
  `u_id` int(4) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `u_name` varchar(20) DEFAULT '' COMMENT '用户登录的用户名',
  `u_password` varchar(35) DEFAULT '' COMMENT '用户的登录密码',
  `u_allowed` tinyint(1) DEFAULT 0 COMMENT '用户是否被后台管理员屏蔽（0未屏蔽，1有屏蔽）',
  `u_flag` tinyint(1) DEFAULT NULL COMMENT '激活状态0:未激活1:已激活',
  `u_reg_time` varchar(20) DEFAULT '' COMMENT '用户的注册时间',
  `u_last_entertime` varchar(20) DEFAULT '' COMMENT '用户最后一次登录的时间',
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ac_user
-- ----------------------------
INSERT INTO `ac_user` VALUES ('1', 'qwe123', '123456', '1', '0', '1608441270000', '1608873310000');
INSERT INTO `ac_user` VALUES ('2', 'asd123', '123456', '1', '0', '1608441270000', '1608873310000');

-- ----------------------------
-- Table structure for ac_user_info
-- ----------------------------
DROP TABLE IF EXISTS `ac_user_info`;
CREATE TABLE `ac_user_info` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '用户详情表的id',
  `u_id` int(4) DEFAULT NULL COMMENT '用户的id',
  `u_nick_name` varchar(50) DEFAULT NULL COMMENT '用户的昵称',
  `u_avant_url` varchar(50) DEFAULT '' COMMENT '用户的头像地址',
  `u_sex` tinyint(1) DEFAULT 0 COMMENT '用户的性别0:男1:女',
  `u_birthday` date DEFAULT NULL COMMENT '用户的出生日期',
  `u_phone` varchar(15) DEFAULT NULL COMMENT '用户的手机号码',
  `u_email` varchar(50) DEFAULT NULL COMMENT '用户的电子邮箱',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ac_user_info
-- ----------------------------
INSERT INTO `ac_user_info` VALUES ('0', '1', '凉了', '/img/4.jpg', '0', null, null, null);
INSERT INTO `ac_user_info` VALUES ('5', '2', '明明', '/img/11.jpeg', '1', '2017-01-25', '12345678912', '123@qq.com');

-- ----------------------------
-- View structure for ac_role_power
-- ----------------------------
DROP VIEW IF EXISTS `ac_role_power`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost`  VIEW `ac_role_power` AS SELECT
ac_role.role_id,
ac_role.role_name,
ac_power.power_id,
ac_power.power_name,
ac_power.power_c_a,
ac_power.power_flag,
ac_power.power_parent_id,
ac_role_to_power.zid
FROM
ac_role ,
ac_role_to_power ,
ac_power
WHERE
ac_role.role_id = ac_role_to_power.role_id AND
ac_role_to_power.power_id = ac_power.power_id ;

-- ----------------------------
-- View structure for ac_user_user_info
-- ----------------------------
DROP VIEW IF EXISTS `ac_user_user_info`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost`  VIEW `ac_user_user_info` AS SELECT
ac_user.u_id,
ac_user.u_name,
ac_user.u_password,
ac_user.u_allowed,
ac_user.u_flag,
ac_user.u_reg_time,
ac_user.u_last_entertime,
ac_user_info.id,
ac_user_info.u_nick_name,
ac_user_info.u_avant_url,
ac_user_info.u_sex,
ac_user_info.u_birthday,
ac_user_info.u_phone,
ac_user_info.u_email
FROM
ac_user ,
ac_user_info
WHERE
ac_user.u_id = ac_user_info.u_id ;
