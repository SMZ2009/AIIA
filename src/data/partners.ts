export interface PartnerData {
  id: string
  name: string
  description: string
  logoUrl: string
  websiteUrl: string
}

export const partners: PartnerData[] = [
  {
    id: '1',
    name: '校学生会',
    description: '联合举办校园文化节与迎新活动。',
    logoUrl: '',
    websiteUrl: '',
  },
  {
    id: '2',
    name: '计算机协会',
    description: '技术交流与 Hackathon 合作。',
    logoUrl: '',
    websiteUrl: '',
  },
  {
    id: '3',
    name: '青年志愿者协会',
    description: '共同开展社区公益与支教活动。',
    logoUrl: '',
    websiteUrl: '',
  },
  {
    id: '4',
    name: '摄影社',
    description: '活动拍摄与宣传素材合作。',
    logoUrl: '',
    websiteUrl: '',
  },
]
