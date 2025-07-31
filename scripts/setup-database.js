// Setup database with indexes and initial configuration
const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/"

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("wellness-platform")

    console.log("🔧 Setting up database...")

    // Create indexes for better performance
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ created_at: -1 })

    await db.collection("sessions").createIndex({ user_id: 1 })
    await db.collection("sessions").createIndex({ status: 1 })
    await db.collection("sessions").createIndex({ created_at: -1 })
    await db.collection("sessions").createIndex({ updated_at: -1 })
    await db.collection("sessions").createIndex({ tags: 1 })
    await db.collection("sessions").createIndex({ title: "text", tags: "text" })

    console.log("✅ Database setup completed!")
    console.log("📊 Indexes created for optimal performance")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
  } finally {
    await client.close()
  }
}

setupDatabase()
