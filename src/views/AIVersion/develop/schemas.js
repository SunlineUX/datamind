/**
 * 数据开发页面配置：
 * - FORM_SCHEMAS：批量调度 / 批量交换的表单 JSON schema（JsonForm 据此渲染整合表单）
 * - SQL_TEMPLATES：各 SQL 类型的新建默认脚本
 * - defaultFormData：按 schema 生成表单默认数据
 */

/** 字段快捷构造 */
const f = (key, labelKey, type, extra = {}) => ({ key, labelKey, type, ...extra });

/** 枚举 → 下拉选项（labelKey 指向 develop.enums.*） */
const opts = (ns, values) => values.map((v) => ({ value: v, labelKey: `develop.enums.${ns}.${v}` }));

/** 批量调度：参考「作业管理-查看」，5 个步骤整合为一页表单 */
const scheduleSchema = {
  sections: [
    {
      key: 'basic',
      titleKey: 'develop.form.basic.title',
      fields: [
        f('taskName', 'develop.form.basic.taskName', 'input', { required: true }),
        f('taskType', 'develop.form.basic.taskType', 'select', { options: opts('taskType', ['modeling', 'script']) }),
        f('owner', 'develop.form.basic.owner', 'input', { value: '张三' }),
        f('priority', 'develop.form.basic.priority', 'select', { options: opts('priority', ['high', 'medium', 'low']), value: 'medium' }),
        f('desc', 'develop.form.basic.desc', 'textarea'),
      ],
    },
    {
      key: 'cycle',
      titleKey: 'develop.form.cycle.title',
      fields: [
        f('scheduleType', 'develop.form.cycle.scheduleType', 'select', { options: opts('scheduleType', ['minute', 'hour', 'day', 'week', 'month']), value: 'day' }),
        f('interval', 'develop.form.cycle.interval', 'input', { value: '1' }),
        f('time', 'develop.form.cycle.time', 'input', { value: '00:30' }),
        f('rerun', 'develop.form.cycle.rerun', 'select', { options: opts('rerun', ['allow', 'forbid']), value: 'allow' }),
      ],
    },
    {
      key: 'deps',
      titleKey: 'develop.form.deps.title',
      fields: [
        f('upstream', 'develop.form.deps.upstream', 'table', {
          columns: [
            { key: 'name', labelKey: 'develop.form.deps.depName', type: 'input' },
            { key: 'status', labelKey: 'develop.form.deps.depStatus', type: 'select', options: opts('depStatus', ['waiting', 'running', 'success']) },
          ],
          rows: [{ name: 'ods_member_info', status: 'success' }],
        }),
        f('crossCycle', 'develop.form.deps.crossCycle', 'select', { options: opts('crossCycle', ['self', 'none']), value: 'self' }),
      ],
    },
    {
      key: 'params',
      titleKey: 'develop.form.params.title',
      fields: [
        f('timeout', 'develop.form.params.timeout', 'input', { value: '60' }),
        f('retries', 'develop.form.params.retries', 'input', { value: '3' }),
        f('params', 'develop.form.params.params', 'table', {
          columns: [
            { key: 'name', labelKey: 'develop.form.params.paramName', type: 'input' },
            { key: 'value', labelKey: 'develop.form.params.paramValue', type: 'input' },
            { key: 'note', labelKey: 'develop.form.params.note', type: 'input' },
          ],
          rows: [{ name: 'bizdate', value: '${bdp.system.bizdate}', note: '业务日期' }],
        }),
      ],
    },
    {
      key: 'effective',
      titleKey: 'develop.form.effective.title',
      fields: [
        f('startDate', 'develop.form.effective.startDate', 'input', { value: '2026-01-01' }),
        f('endDate', 'develop.form.effective.endDate', 'input', { value: '2027-12-31' }),
        f('calendar', 'develop.form.effective.calendar', 'select', { options: opts('calendar', ['all', 'workday', 'holiday']), value: 'all' }),
      ],
    },
  ],
};

/** 批量交换：参考「数据接入-发布清单-操作」，来源/目标/映射/配置整合为一页表单 */
const exchangeSchema = {
  sections: [
    {
      key: 'basic',
      titleKey: 'develop.form.basic.title',
      fields: [
        f('taskName', 'develop.form.basic.taskName', 'input', { required: true }),
        f('sourceSystem', 'develop.form.basic.sourceSystem', 'select', { options: opts('system', ['mysql', 'ods', 'api']), value: 'mysql' }),
        f('targetSystem', 'develop.form.basic.targetSystem', 'select', { options: opts('system', ['dw', 'mysql', 'es']), value: 'dw' }),
        f('desc', 'develop.form.basic.desc', 'textarea'),
      ],
    },
    {
      key: 'source',
      titleKey: 'develop.form.source.title',
      fields: [
        f('sourceType', 'develop.form.source.sourceType', 'select', { options: opts('dbType', ['mysql', 'oracle', 'api', 'hdfs']), value: 'mysql' }),
        f('sourceConn', 'develop.form.source.conn', 'select', { options: opts('conn', ['mysqlProd', 'oracleFin', 'apiOpen']), value: 'mysqlProd' }),
        f('sourceTable', 'develop.form.source.table', 'input', { value: 'ods_member_info' }),
        f('filter', 'develop.form.source.filter', 'input', { placeholder: 'where dt = ...' }),
      ],
    },
    {
      key: 'target',
      titleKey: 'develop.form.target.title',
      fields: [
        f('targetType', 'develop.form.target.targetType', 'select', { options: opts('dbType', ['mysql', 'oracle', 'api', 'hdfs']), value: 'mysql' }),
        f('targetConn', 'develop.form.target.conn', 'select', { options: opts('conn', ['mysqlDw', 'esLog']), value: 'mysqlDw' }),
        f('targetTable', 'develop.form.target.table', 'input', { value: 'dwd_member_info' }),
        f('writeMode', 'develop.form.target.writeMode', 'select', { options: opts('writeMode', ['overwrite', 'append', 'update']), value: 'overwrite' }),
      ],
    },
    {
      key: 'mapping',
      titleKey: 'develop.form.mapping.title',
      fields: [
        f('mapping', 'develop.form.mapping.mapping', 'table', {
          columns: [
            { key: 'source', labelKey: 'develop.form.mapping.source', type: 'input' },
            { key: 'target', labelKey: 'develop.form.mapping.target', type: 'input' },
            { key: 'func', labelKey: 'develop.form.mapping.func', type: 'select', options: opts('func', ['none', 'trim', 'upper', 'to_date']) },
          ],
          rows: [
            { source: 'user_id', target: 'member_id', func: 'none' },
            { source: 'user_name', target: 'member_name', func: 'trim' },
            { source: 'created_at', target: 'register_time', func: 'to_date' },
          ],
        }),
      ],
    },
    {
      key: 'settings',
      titleKey: 'develop.form.settings.title',
      fields: [
        f('syncType', 'develop.form.settings.syncType', 'select', { options: opts('syncType', ['full', 'increment']), value: 'increment' }),
        f('incrField', 'develop.form.settings.incrField', 'input', { value: 'updated_at' }),
        f('batchSize', 'develop.form.settings.batchSize', 'input', { value: '1000' }),
        f('concurrency', 'develop.form.settings.concurrency', 'input', { value: '4' }),
      ],
    },
  ],
};

export const FORM_SCHEMAS = {
  'batch-schedule': scheduleSchema,
  'batch-exchange': exchangeSchema,
};

/** SQL 类型新建时的默认脚本 */
export const SQL_TEMPLATES = {
  'batch-modeling': `-- 批量建模：模型 DDL
CREATE TABLE IF NOT EXISTS dm_member_profile (
  member_id     BIGINT COMMENT '会员ID',
  member_name   STRING COMMENT '会员名称',
  level         STRING COMMENT '会员等级',
  register_time DATETIME COMMENT '注册时间',
  dt            STRING COMMENT '分区日期'
) PARTITIONED BY (dt) COMMENT '会员宽表';`,
  'batch-script': `-- 批量脚本：数据加工
INSERT OVERWRITE TABLE dm_member_profile PARTITION (dt = '\${bdp.system.bizdate}')
SELECT member_id,
       member_name,
       CASE WHEN score >= 90 THEN 'gold'
            WHEN score >= 60 THEN 'silver'
            ELSE 'bronze' END AS level,
       register_time
FROM   ods_member_info
WHERE  dt = '\${bdp.system.bizdate}';`,
  'realtime-compute': `-- 实时计算：实时指标加工
CREATE TEMPORARY TABLE realtime_pvuv (
  window_start TIMESTAMP,
  pv           BIGINT,
  uv           BIGINT
) WITH (
  'connector' = 'print'
);

INSERT INTO realtime_pvuv
SELECT window_start,
       COUNT(*)             AS pv,
       COUNT(DISTINCT uid)  AS uv
FROM   source_log
GROUP BY TUMBLE(ts, INTERVAL '1' MINUTE);`,
  'realtime-collect': `-- 实时采集：源库实时同步
INSERT INTO ods_order_realtime
SELECT order_id,
       user_id,
       amount,
       status,
       updated_at
FROM   mysql_order
/*+ OPTIONS('scan.startup.mode' = 'latest-offset') */;`,
};

/** 按 schema 生成表单默认数据（含表格默认行） */
export function defaultFormData(schema) {
  const data = {};
  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (field.type === 'table') {
        data[field.key] = (field.rows || []).map((row) => ({ ...row }));
      } else {
        data[field.key] = field.value !== undefined ? field.value : '';
      }
    }
  }
  return data;
}
