import { useUsers } from '@/services/admin/business-owner-service';
import {
  type Permission,
  useAddGroupPermission,
  useAddGroupUser,
  useGroupById,
  useRemoveGroupPermission,
  useRemoveGroupUser,
} from '@/services/owner/group-service';
import { useParams } from 'react-router-dom';
import { useUserPermissions } from '@/components/common/states/userState';
import GroupCardView from './card-view';

const GroupConfig = () => {
  const { id } = useParams<{ id: string }>();

  // Only call the hook if id is defined
  const { group } = useGroupById({ id: id! });
  const { permissions } = useUserPermissions();
  const { users } = useUsers({ page: 1, limit: 50 });
  const { addGroupPermission } = useAddGroupPermission();
  const { removeGroupPermission } = useRemoveGroupPermission();
  const { addGroupUser } = useAddGroupUser();
  const { removeGroupUser } = useRemoveGroupUser();

  const currentPermission =
    group?.permissions?.map((permission) => ({
      label: permission.description,
      value: permission._id,
    })) || [];

  const availablePermission =
    permissions?.map((permission: Permission) => ({
      label: permission.description,
      value: permission._id,
    })) || [];

  const currentUserGroups =
    group?.users?.map((user) => ({
      label: user.name,
      value: user._id,
    })) || [];

  const availableUserGroups =
    users?.map((user) => ({
      label: user.name,
      value: user._id,
    })) || [];

  if (!id || !group) {
    return null;
  }

  const onGroupPermissionSave = async (selectedGroups: { label: string; value: string }[]) => {
    // Logic to handle saving the selected groups
    console.log('Selected Groups:', selectedGroups);
    const addPermissionIds = selectedGroups
      .filter((group) => !currentPermission.some((current) => current.value === group.value))
      .map((group) => group.value);

    const deletePermissionIds = currentPermission
      .filter((group) => !selectedGroups.some((selected) => selected.value === group.value))
      .map((group) => group.value);
    await addGroupPermission({
      groupId: id,
      permissions: addPermissionIds,
    });

    await removeGroupPermission({
      groupId: id,
      permissions: deletePermissionIds,
    });
  };

  const onUserGroupSave = async (selectedGroups: { label: string; value: string }[]) => {
    // Logic to handle saving the selected user groups
    console.log('Selected User Groups:', selectedGroups);
    const deleteUserIds = currentUserGroups.filter(
      (group) => !selectedGroups.some((selected) => selected.value === group.value)
    );
    const addUserIds = selectedGroups.filter(
      (group) => !currentUserGroups.some((current) => current.value === group.value)
    );

    for (const userId of addUserIds) {
      await addGroupUser({
        groupId: id,
        userId: userId.value,
      });
    }
    for (const userId of deleteUserIds) {
      await removeGroupUser({
        groupId: id,
        userId: userId.value,
      });
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <GroupCardView
        title={'Permission Group Configuration'}
        leftPaneTitle="Available Permission Groups"
        rightPaneTitle="Selected Permission Groups"
        leftPaneGroups={availablePermission}
        rightPaneGroups={currentPermission}
        description={
          'Select a permission group by clicking on the group name on the left. Click the X icon to remove a group from the selected list.'
        }
        onSave={onGroupPermissionSave}
      />
      <GroupCardView
        title={'Users Group Configuration'}
        leftPaneTitle="Available User Groups"
        rightPaneTitle="Selected User Groups"
        leftPaneGroups={availableUserGroups}
        rightPaneGroups={currentUserGroups}
        description={
          'Select a user group by clicking on the group name on the left. Click the X icon to remove a group from the selected list.'
        }
        onSave={onUserGroupSave}
      />
    </div>
  );
};

export default GroupConfig;
