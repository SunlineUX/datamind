import dataDevIcon from '../../../assets/platform/dev.png';
import dataAnalysisIcon from '../../../assets/platform/indicator.png';
import dataServiceIcon from '../../../assets/platform/server.png';
import dataGovernanceIcon from '../../../assets/platform/governance.png';
import designSpecIcon from '../../../assets/platform/norm.png';

export const domains = [
	{
		key: 'data-dev',
		label: '数据开发',
		icon: dataDevIcon,
		groups: [
			{
				key: 'data-integration',
				label: '数据集成',
				items: [
					{ key: 'db-to-file', label: '数据库到文件', icon: 'LayersThreeAlt', to: '/data-dev/data-integration/db-to-file' },
					{ key: 'file-push', label: '文件推送传输', icon: 'Cartificate01', to: '/data-dev/data-integration/file-push' },
					{ key: 'file-to-db', label: '文件到数据库', icon: 'FileText', to: '/data-dev/data-integration/file-to-db' },
					{ key: 'db-sync', label: '库间数据同步', icon: 'Refresh', to: '/data-dev/data-integration/db-sync' },
					{ key: 'realtime-collect', label: '实时数据采集', icon: 'Dataflow02', to: '/data-dev/data-integration/realtime-collect' },
				],
			},
			{
				key: 'machine-learning',
				label: '机器学习',
				items: [
					{ key: 'ml-overview', label: '概览', icon: 'LayoutDashboard', to: '/data-dev/ml' },
					{ key: 'ml-data-prep', label: '数据准备', icon: 'Database03', to: '/data-dev/ml/data-prep', children: [
						{ key: 'ml-dataset', label: '数据集', to: '/data-dev/ml/data-prep/dataset' },
						{ key: 'ml-operator', label: '算子', to: '/data-dev/ml/data-prep/operator' },
					] },
					{ key: 'ml-training', label: '模型训练', icon: 'AiGenerate', to: '/data-dev/ml/model-training', children: [
						{ key: 'ml-visual-modeling', label: '可视化建模', to: '/data-dev/ml/model-training/visual-modeling' },
						{ key: 'ml-auto-modeling', label: '自动建模', to: '/data-dev/ml/model-training/auto-modeling' },
					] },
					{ key: 'ml-management', label: '模型管理', icon: 'Box', to: '/data-dev/ml/model-management' },
					{ key: 'ml-inference', label: '模型服务', icon: 'Rocket', to: '/data-dev/ml/model-inference' },
				],
			},
		],
	},
	{
		key: 'data-analysis', label: '数据分析', icon: dataAnalysisIcon, groups: [
			{ key: 'report', label: '报表管理', items: [
				{ key: 'report-design', label: '报表设计', icon: 'FileText', to: '/data-analysis/report-mgmt/design' },
				{ key: 'report-release', label: '报表发布', icon: 'Compass', to: '/data-analysis/report-mgmt/release' },
			] },
			{ key: 'dashboard', label: '大屏管理', items: [
				{ key: 'dash-design', label: '大屏设计', icon: 'LayoutDashboard', to: '/data-analysis/dash-mgmt/design' },
				{ key: 'dash-release', label: '大屏发布', icon: 'Rocket', to: '/data-analysis/dash-mgmt/release' },
			] },
		],
	},
	{
		key: 'data-service', label: '数据服务', icon: dataServiceIcon, groups: [
			{ key: 'api', label: 'API管理', items: [
				{ key: 'api-design', label: 'API设计', icon: 'Code', to: '/data-service/api-mgmt/design' },
				{ key: 'api-test', label: 'API测试', icon: 'Category', to: '/data-service/api-mgmt/test' },
				{ key: 'api-release', label: 'API发布', icon: 'Compass', to: '/data-service/api-mgmt/release' },
			] },
		],
	},
	{
		key: 'data-governance', label: '数据治理', icon: dataGovernanceIcon, groups: [
			{ key: 'metadata', label: '元数据', items: [
				{ key: 'metadata-overview', label: '元数据概况', icon: 'LayoutDashboard', to: '/data-governance/metadata/overview' },
				{ key: 'metadata-map', label: '数据地图', icon: 'Map', to: '/data-governance/metadata/map' },
				{ key: 'metadata-collect', label: '元数据采集', icon: 'Edit', to: '/data-governance/metadata/collect' },
				// { key: 'metadata-dictionary', label: '数据字典管理', icon: 'Book', to: '/data-governance/metadata/dictionary' },
				// { key: 'metadata-analysis', label: '数据分析', icon: 'DataHistogram', to: '/data-governance/metadata/analysis' },
			] },
			// { key: 'standard', label: '数据标准', items: [
			// 	{ key: 'standard-browse', label: '数据标准浏览', icon: 'FileCheck', to: '/data-governance/standard/browse' },
			// 	{ key: 'standard-maintain', label: '数据标准维护', icon: 'Setting', to: '/data-governance/standard/maintain' },
			// 	{ key: 'standard-version', label: '数据标准定版', icon: 'GitBranch', to: '/data-governance/standard/version' },
			// ] },
		],
	},
	// {
	// 	key: 'design-spec', label: '设计规范', icon: designSpecIcon, groups: [
	// 		{ key: 'design', label: '基础规范', items: [
	// 			{ key: 'intro', label: '简介', icon: 'Book', to: '/design-spec/introduction/intro' },
	// 			{ key: 'color', label: '色彩', icon: 'Palette', to: '/design-spec/global-style/color' },
	// 			{ key: 'typography', label: '字体', icon: 'Type', to: '/design-spec/global-style/typography' },
	// 			{ key: 'components', label: '开发组件', icon: 'Component', to: '/design-spec/resource/components' },
	// 		] },
	// 	],
	// },
];
export const menuGroups = domains[0].groups;

export const homeModules = [
	{ key: 'api', label: '数据API', icon: 'ApiApp', color: '#3d8df5' },
	{ key: 'gateway', label: '数据网关', icon: 'DatabaseCloud', color: '#3d8df5' },
	{ key: 'intelligence', label: '数据智能', icon: 'Sparkle', color: '#4d9cff' },
	{ key: 'quality', label: '数据质量', icon: 'ShieldCheck', color: '#3d8df5' },
	{ key: 'asset', label: '数据资产', icon: 'Box', color: '#3d8df5' },
	{ key: 'integration', label: '数据集成', icon: 'Dataflow02', color: '#3d8df5' },
	{ key: 'model', label: '数据模型设计', icon: 'Database03', color: '#3d8df5' },
	{ key: 'monitor', label: '数据质量管理', icon: 'Activity', color: '#3d8df5' },
	{ key: 'tag', label: '标签画像', icon: 'Tag', color: '#3d8df5' },
	{ key: 'service', label: '数据服务', icon: 'ApiApp', color: '#3d8df5' },
	{ key: 'engine', label: '智能引擎', icon: 'Zap', color: '#3d8df5' },
	{ key: 'develop', label: '数据开发', icon: 'Code', color: '#3d8df5' },
	{ key: 'tag-dev', label: '标签开发', icon: 'Tag', color: '#3d8df5' },
	{ key: 'center', label: '数据调度中心', icon: 'Calendar', color: '#3d8df5' },
	{ key: 'catalog', label: '数据资产目录', icon: 'Folder', color: '#3d8df5' },
	{ key: 'security', label: '安全合规扫描', icon: 'ShieldCheck', color: '#3d8df5' },
	{ key: 'service-dev', label: '数据服务开发', icon: 'Code', color: '#3d8df5' },
	{ key: 'asset-dev', label: '数据资产开发', icon: 'Box', color: '#3d8df5' },
	{ key: 'schedule', label: '作业调度', icon: 'Clock', color: '#3d8df5' },
	{ key: 'stream', label: '流式计算开发', icon: 'Activity', color: '#3d8df5' },
];
