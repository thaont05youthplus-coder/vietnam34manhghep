import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Dữ liệu 34 Tỉnh / Thành phố
  provinces: defineTable({
    provinceCode: v.string(), // ví dụ: "VN01", "VN48", "VN56"
    name: v.string(),         // Tên có dấu tiếng Việt, ví dụ: "Đà Nẵng", "Khánh Hòa"
    nameAscii: v.string(),    // "Da Nang", "Khanh Hoa"
    oldName: v.optional(v.string()), // Tên địa phương cũ trước sắp xếp
    economicRegionId: v.string(),   // Thuộc 1 trong 6 vùng kinh tế - xã hội
    naturalRegionId: v.string(),    // Thuộc 1 trong 7 khu vực tự nhiên
    areaSqKm: v.number(),
    centerCoord: v.object({
      lat: v.number(),
      lon: v.number(),
    }),
    overview: v.string(), // Vị trí địa lí, tiếp giáp, khái quát
    naturalFeatures: v.object({
      terrain: v.string(),
      climate: v.string(),
      rivers: v.string(),
      naturalHazards: v.string(),
    }),
    socioEconomics: v.object({
      population: v.string(),
      culture: v.string(),
      agriculture: v.string(),
      industry: v.string(),
      services: v.string(),
      transportation: v.string(),
    }),
    images: v.array(
      v.object({
        url: v.string(),
        caption: v.string(),
        source: v.string(),
      })
    ),
    sources: v.array(v.string()),
    updatedAt: v.number(),
  })
    .index("by_code", ["provinceCode"])
    .index("by_name", ["name"])
    .index("by_economic_region", ["economicRegionId"])
    .index("by_natural_region", ["naturalRegionId"]),

  // 2. Dữ liệu Vùng (6 Vùng Kinh tế - Xã hội và 7 Khu vực Tự nhiên)
  regions: defineTable({
    regionId: v.string(), // ví dụ: "kt_dong_bang_song_hong", "tn_bac_trung_bo"
    type: v.union(v.literal("economic"), v.literal("natural")),
    name: v.string(),
    description: v.string(),
    keyFeatures: v.array(v.string()),
    provinceCodes: v.array(v.string()),
    coverImage: v.string(),
    source: v.string(),
  })
    .index("by_region_id", ["regionId"])
    .index("by_type", ["type"]),

  // 3. Nguồn tài liệu kiểm chứng (Source Catalog)
  source_catalog: defineTable({
    sourceId: v.string(),
    title: v.string(),
    organization: v.string(),
    publicationDate: v.optional(v.string()),
    url: v.optional(v.string()),
    verifiedAt: v.string(),
    notes: v.string(),
  }).index("by_source_id", ["sourceId"]),

  // 4. Chatbox: Phiên hỏi đáp & Lịch sử tin nhắn
  chat_sessions: defineTable({
    userId: v.optional(v.string()), // Guest ID hoặc Auth ID
    contextProvinceCode: v.optional(v.string()), // Ngữ cảnh tỉnh đang chọn (Huế, v.v.)
    contextRegionId: v.optional(v.string()),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  chat_messages: defineTable({
    sessionId: v.id("chat_sessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    citations: v.array(
      v.object({
        sourceId: v.string(),
        title: v.string(),
        url: v.optional(v.string()),
        quote: v.string(),
      })
    ),
    timestamp: v.number(),
  }).index("by_session", ["sessionId"]),

  // 5. Ngân hàng câu hỏi (5 cấp phân loại theo spec Naugh Milk IELTS)
  question_bank: defineTable({
    questionCode: v.string(),
    domain: v.string(),       // Cấp 1: Tự nhiên, Kinh tế - xã hội, Vị trí - lãnh thổ, v.v.
    topic: v.string(),        // Cấp 2: Dân cư, Nông nghiệp, Công nghiệp, Dịch vụ, Du lịch...
    subtopic: v.string(),
    scope: v.string(),        // Cấp 3: Cả nước, Vùng, Tỉnh/thành
    provinceCode: v.optional(v.string()),
    regionId: v.optional(v.string()),
    level: v.union(v.literal("khai_quat"), v.literal("mo_rong"), v.literal("cu_the")), // Cấp 4
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    questionText: v.string(), // Cấp 5
    hint: v.optional(v.string()),
    suggestedAnswer: v.string(),
    sourceIds: v.array(v.string()),
    relatedMapLayers: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_domain_topic", ["domain", "topic"])
    .index("by_province", ["provinceCode"])
    .index("by_region", ["regionId"])
    .index("by_status", ["status"]),

  // 6. Ghi chú cá nhân (Note text + nét vẽ canvas iPad-style)
  notes: defineTable({
    userId: v.optional(v.string()),
    provinceCode: v.optional(v.string()),
    regionId: v.optional(v.string()),
    title: v.string(),
    textContent: v.string(),
    drawingStrokes: v.string(), // Chuỗi JSON mã hóa mảng nét vẽ tọa độ canvas
    mapSnapshotUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_province", ["provinceCode"]),

  // 7. Bộ học phần & Bài kiểm tra (Quizlet-style)
  study_sets: defineTable({
    title: v.string(),
    topic: v.string(),
    scope: v.string(), // "country" | "region" | "province"
    targetCode: v.optional(v.string()), // ID tỉnh hoặc vùng
    cardCount: v.number(),
    items: v.array(
      v.object({
        id: v.string(),
        term: v.string(),       // Thuật ngữ / Câu hỏi / Địa danh
        definition: v.string(), // Định nghĩa / Lời giải / Đặc trưng
        imageUrl: v.optional(v.string()),
        mapFocusProvince: v.optional(v.string()),
      })
    ),
    isPublished: v.boolean(),
    createdAt: v.number(),
  }).index("by_scope", ["scope", "targetCode"]),

  // 8. Lịch sử làm bài kiểm tra & Ôn lại câu sai
  study_attempts: defineTable({
    userId: v.optional(v.string()),
    studySetId: v.id("study_sets"),
    mode: v.union(v.literal("flashcards"), v.literal("learn"), v.literal("test"), v.literal("match")),
    score: v.optional(v.number()),
    totalQuestions: v.number(),
    incorrectItemIds: v.array(v.string()),
    completedAt: v.number(),
  }).index("by_user", ["userId"]),
});
