import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ROLES } from '../constants/roles';
import './UnauthorizedPage.css';

/**
 * 无权限访问页面
 * 当用户尝试访问没有权限的页面时显示
 */
export default function UnauthorizedPage({ requiredRoles = [] }) {
    const navigate = useNavigate();
    const { currentRole, currentUser } = useUser();

    const handleGoBack = () => {
        // 根据当前角色跳转到对应的默认页面
        if (currentRole === ROLES.ADMIN) {
            navigate('/admin/runners', { replace: true });
        } else if (currentRole === ROLES.RUNNER) {
            navigate('/runner-orders', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case ROLES.ADMIN:
                return '管理员';
            case ROLES.RUNNER:
                return '跑腿员';
            case ROLES.STUDENT:
                return '学生';
            default:
                return role;
        }
    };

    const getCurrentRoleName = () => getRoleName(currentRole);
    const getRequiredRolesText = () => {
        if (requiredRoles.length === 0) return '未知';
        return requiredRoles.map(role => getRoleName(role)).join('、');
    };

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-content">
                <div className="unauthorized-icon">
                    <i className="fa fa-lock"></i>
                </div>
                <h1 className="unauthorized-title">访问受限</h1>
                <p className="unauthorized-message">
                    抱歉,您当前的角色 <strong>{getCurrentRoleName()}</strong> 无权访问此页面
                </p>
                {requiredRoles.length > 0 && (
                    <p className="unauthorized-required">
                        此页面需要以下角色权限: <strong>{getRequiredRolesText()}</strong>
                    </p>
                )}
                <div className="unauthorized-user-info">
                    <p>当前用户: {currentUser?.userName || '未登录'}</p>
                    <p>当前角色: {getCurrentRoleName()}</p>
                </div>
                <button className="unauthorized-button" onClick={handleGoBack}>
                    <i className="fa fa-arrow-left"></i>
                    返回首页
                </button>
            </div>
        </div>
    );
}
