export interface BrandCertificate {
  id: string;
  title: string;
  issuedBy: string | null;
  fileUrl: string;
  sortOrder: number;
}

export interface BrandClient {
  id: string;
  name: string;
  logoUrl: string;
}

export interface OnlinePlatform {
  id: string;
  name: string;
  storeUrl: string;
  storeRegion: string;
  iconName: string;
  colorClass: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  imageUrl: string | null;
  mapUrl: string | null;
  sortOrder: number;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photoUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  bio: string | null;
  sortOrder: number;
}

export interface ClassicConceptsBrandInfo {
  success: boolean;
  updatedAt: string;
  brand: {
    companyName: string;
    brandName: string;
    sisterBrand: string;
    sisterBrandUrl: string;
    tagline: string;
    website: string;
    logoUrl: string;
    shortLogoUrl: string;
    heroImageUrl: string;
    aboutIntroImageUrl: string;
    clientCarouselSpeedSeconds: number;
    certifications: {
      iso: string;
      hym: string;
      ga: string;
      ascb: string;
      allCertificates: BrandCertificate[];
    };
    clients: BrandClient[];
    onlinePlatforms: OnlinePlatform[];
  };
  contact: {
    address: string;
    primaryPhone: string;
    secondaryPhone: string | null;
    phones: string[];
    whatsappNumber: string;
    whatsappUrl: string;
    primaryEmail: string;
    secondaryEmail: string | null;
    emails: string[];
    businessHours: string;
    businessHoursLines: string[];
    mapEmbedUrl: string | null;
    payment: {
      upiId: string | null;
      upiName: string | null;
    };
  };
  branches: BranchInfo[];
  team: TeamMember[];
}

export const OFFICIAL_WHATSAPP_API_NUMBER = "+91 73372 20568";
export const OFFICIAL_WHATSAPP_API_DIGITS = "917337220568";
export const OFFICIAL_WHATSAPP_API_URL = `https://wa.me/${OFFICIAL_WHATSAPP_API_DIGITS}`;

export async function getClassicConceptsBrandInfo(): Promise<ClassicConceptsBrandInfo | null> {
  try {
    const res = await fetch("https://classicconcepts.in/api/brand-info", {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.error("Failed to fetch Classic Concepts brand info:", res.status);
      return null;
    }
    const data = (await res.json()) as ClassicConceptsBrandInfo;
    if (data?.contact) {
      data.contact.whatsappNumber = OFFICIAL_WHATSAPP_API_NUMBER;
      data.contact.whatsappUrl = OFFICIAL_WHATSAPP_API_URL;
    }
    if (Array.isArray(data?.team)) {
      data.team = data.team.map((member) => ({
        ...member,
        whatsapp: OFFICIAL_WHATSAPP_API_NUMBER,
      }));
    }
    return data;
  } catch (error) {
    console.error("Error fetching Classic Concepts brand info:", error);
    return null;
  }
}
