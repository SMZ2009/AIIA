export interface MemberData {
  id: string
  name: string
  role: string
  bio: string
  avatarUrl: string
}

export const members: MemberData[] = [
  {
    id: '1',
    name: '张三',
    role: '社长',
    bio: '负责组织整体规划与对外联络，推动社团数字化建设。',
    avatarUrl: '',
  },
  {
    id: '2',
    name: '李四',
    role: '副社长',
    bio: '分管活动策划与执行，组织多场校园大型活动。',
    avatarUrl: '',
  },
  {
    id: '3',
    name: '王五',
    role: '技术部部长',
    bio: '负责社团网站开发与技术培训，热爱开源社区。',
    avatarUrl: '',
  },
  {
    id: '4',
    name: '赵六',
    role: '宣传部部长',
    bio: '负责社团品牌推广与新媒体运营。',
    avatarUrl: '',
  },
  {
    id: '5',
    name: '陈七',
    role: '外联部部长',
    bio: '对接校内外合作组织，拓展社团资源网络。',
    avatarUrl: '',
  },
  {
    id: '6',
    name: '刘八',
    role: '活动部部长',
    bio: '策划与执行社团日常活动，注重成员体验。',
    avatarUrl: '',
  },
]
