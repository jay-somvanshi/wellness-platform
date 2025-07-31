// Seed database with sample data
const { MongoClient, ObjectId } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("wellness-platform")

    console.log("🌱 Seeding database...")

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("sessions").deleteMany({})

    // Create demo users
    const demoPassword = await bcrypt.hash("demo123", 12)

    const users = await db.collection("users").insertMany([
      {
        email: "demo@wellness.com",
        password_hash: demoPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "instructor@wellness.com",
        password_hash: demoPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "admin@wellness.com",
        password_hash: demoPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    const [demoUser, instructorUser, adminUser] = Object.values(users.insertedIds)

    // Create sample sessions
    const now = new Date()
    await db.collection("sessions").insertMany([
      {
        user_id: instructorUser,
        title: "Morning Yoga Flow",
        tags: ["yoga", "morning", "flexibility", "beginner"],
        json_file_url: "https://example.com/sessions/morning-yoga.json",
        status: "published",
        created_at: new Date(now.getTime() - 86400000), // 1 day ago
        updated_at: new Date(now.getTime() - 86400000),
        published_at: new Date(now.getTime() - 86400000),
      },
      {
        user_id: instructorUser,
        title: "Mindfulness Meditation",
        tags: ["meditation", "mindfulness", "relaxation", "stress-relief"],
        json_file_url: "https://example.com/sessions/mindfulness.json",
        status: "published",
        created_at: new Date(now.getTime() - 172800000), // 2 days ago
        updated_at: new Date(now.getTime() - 172800000),
        published_at: new Date(now.getTime() - 172800000),
      },
      {
        user_id: instructorUser,
        title: "Evening Wind Down",
        tags: ["relaxation", "evening", "sleep", "breathing"],
        json_file_url: "https://example.com/sessions/evening-winddown.json",
        status: "published",
        created_at: new Date(now.getTime() - 259200000), // 3 days ago
        updated_at: new Date(now.getTime() - 259200000),
        published_at: new Date(now.getTime() - 259200000),
      },
      {
        user_id: adminUser,
        title: "Power Vinyasa Flow",
        tags: ["yoga", "power", "strength", "intermediate"],
        json_file_url: "https://example.com/sessions/power-vinyasa.json",
        status: "published",
        created_at: new Date(now.getTime() - 345600000), // 4 days ago
        updated_at: new Date(now.getTime() - 345600000),
        published_at: new Date(now.getTime() - 345600000),
      },
      {
        user_id: adminUser,
        title: "Breathing Techniques",
        tags: ["breathing", "pranayama", "meditation", "beginner"],
        json_file_url: "https://example.com/sessions/breathing.json",
        status: "published",
        created_at: new Date(now.getTime() - 432000000), // 5 days ago
        updated_at: new Date(now.getTime() - 432000000),
        published_at: new Date(now.getTime() - 432000000),
      },
      {
        user_id: demoUser,
        title: "My Personal Practice",
        tags: ["personal", "custom"],
        json_file_url: "",
        status: "draft",
        created_at: new Date(now.getTime() - 3600000), // 1 hour ago
        updated_at: new Date(now.getTime() - 1800000), // 30 min ago
      },
      {
        user_id: instructorUser,
        title: "Advanced Meditation Series",
        tags: ["meditation", "advanced", "series"],
        json_file_url: "https://example.com/sessions/advanced-meditation.json",
        status: "draft",
        created_at: new Date(now.getTime() - 7200000), // 2 hours ago
        updated_at: new Date(now.getTime() - 900000), // 15 min ago
      },
    ])

    console.log("✅ Database seeded successfully!")
    console.log("\n📧 Demo accounts created:")
    console.log("Email: demo@wellness.com")
    console.log("Email: instructor@wellness.com")
    console.log("Email: admin@wellness.com")
    console.log("Password: demo123 (for all accounts)")
    console.log("\n🚀 You can now login and test all features!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
