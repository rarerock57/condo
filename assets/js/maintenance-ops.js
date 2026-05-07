/**
 * Smart Condo Maintenance Operations Helper
 * ใช้เสริมในหน้า admin/technician/resident สำหรับ:
 * - Audit Log
 * - Notification
 *
 * วิธีใช้:
 * 1) ใส่ไฟล์นี้ที่ assets/js/maintenance-ops.js
 * 2) เพิ่ม script หลัง supabase-client.js:
 *    <script src="../assets/js/maintenance-ops.js"></script>
 * 3) ตั้งค่า MAINTENANCE_NOTIFY_GAS_URL ถ้ามี GAS notification URL
 */

const MAINTENANCE_NOTIFY_GAS_URL = '';

function getActorInfo(profile, user) {
  return {
    actor_id: user?.id || null,
    actor_name: profile?.full_name || profile?.username || profile?.name || 'unknown',
    actor_role: profile?.role || 'unknown'
  };
}

async function addMaintenanceAuditLog({
  requestId,
  action,
  oldStatus = null,
  newStatus = null,
  profile = null,
  user = null,
  note = null,
  metadata = {}
}) {
  try {
    if (!window.supabaseClient) {
      console.warn('supabaseClient not found');
      return null;
    }

    const actor = getActorInfo(profile, user);

    const { data, error } = await supabaseClient.rpc('add_maintenance_audit_log', {
      p_request_id: Number(requestId),
      p_action: action,
      p_old_status: oldStatus,
      p_new_status: newStatus,
      p_actor_id: actor.actor_id,
      p_actor_name: actor.actor_name,
      p_actor_role: actor.actor_role,
      p_note: note,
      p_metadata: metadata || {}
    });

    if (error) {
      console.warn('Audit log error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.warn('Audit log exception:', err);
    return null;
  }
}

async function notifyMaintenanceEvent({
  eventType,
  request = {},
  status = '',
  profile = null,
  user = null,
  note = ''
}) {
  try {
    if (!MAINTENANCE_NOTIFY_GAS_URL) {
      return null;
    }

    const actor = getActorInfo(profile, user);

    const payload = {
      event_type: eventType,
      request_id: request.id || null,
      room: request.room_id || '',
      title: request.title || '',
      status,
      actor_name: actor.actor_name,
      actor_role: actor.actor_role,
      note
    };

    const res = await fetch(MAINTENANCE_NOTIFY_GAS_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return await res.json();
  } catch (err) {
    console.warn('Notify maintenance event error:', err);
    return null;
  }
}

window.MaintenanceOps = {
  addMaintenanceAuditLog,
  notifyMaintenanceEvent,
  getActorInfo
};