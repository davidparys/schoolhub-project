// Simple Node.js script to fill the database with sample data
// Run with: node fill-database.js

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
// Use service role key for admin operations that bypass RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'your-service-role-key'

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample data
const sampleStudents = [
  { first_name: 'Jan', last_name: 'Kowalski' },
  { first_name: 'Anna', last_name: 'Nowak' },
  { first_name: 'Piotr', last_name: 'Wiśniewski' },
  { first_name: 'Maria', last_name: 'Kowalczyk' },
  { first_name: 'Tomasz', last_name: 'Kamiński' },
  { first_name: 'Katarzyna', last_name: 'Lewandowska' },
  { first_name: 'Michał', last_name: 'Zieliński' },
  { first_name: 'Magdalena', last_name: 'Szymańska' },
  { first_name: 'Paweł', last_name: 'Dąbrowski' },
  { first_name: 'Agnieszka', last_name: 'Kozłowska' },
  { first_name: 'Jakub', last_name: 'Jankowski' },
  { first_name: 'Ewa', last_name: 'Mazur' },
  { first_name: 'Łukasz', last_name: 'Krawczyk' },
  { first_name: 'Monika', last_name: 'Piotrowska' },
  { first_name: 'Marcin', last_name: 'Grabowski' }
]

const sampleClasses = [
  { 
    name: 'Matematyka', 
    description: 'Podstawy matematyki dla uczniów - algebra, geometria, analiza matematyczna' 
  },
  { 
    name: 'Fizyka', 
    description: 'Wprowadzenie do fizyki - mechanika, termodynamika, optyka' 
  },
  { 
    name: 'Chemia', 
    description: 'Podstawy chemii organicznej i nieorganicznej' 
  },
  { 
    name: 'Biologia', 
    description: 'Nauki o życiu - anatomia, genetyka, ekologia' 
  },
  { 
    name: 'Historia', 
    description: 'Historia Polski i świata - od starożytności po współczesność' 
  },
  { 
    name: 'Język Polski', 
    description: 'Literatura polska i światowa, gramatyka, retoryka' 
  },
  { 
    name: 'Język Angielski', 
    description: 'Praktyczna nauka języka angielskiego - konwersacja i gramatyka' 
  },
  { 
    name: 'Geografia', 
    description: 'Geografia fizyczna i społeczno-ekonomiczna świata' 
  },
  { 
    name: 'Informatyka', 
    description: 'Podstawy programowania i technologii informatycznych' 
  },
  { 
    name: 'Wychowanie Fizyczne', 
    description: 'Aktywność fizyczna i sport - rozwój kondycji i sprawności' 
  }
]

async function clearDatabase() {
  console.log('🧹 Clearing existing data...')
  
  try {
    // Clear in order due to foreign key constraints
    await supabase.from('class_assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('classes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('✅ Database cleared successfully')
    return true
  } catch (error) {
    console.error('❌ Error clearing database:', error.message)
    return false
  }
}

async function insertStudents() {
  console.log('👥 Inserting students...')
  
  const { data, error } = await supabase
    .from('students')
    .insert(sampleStudents)
    .select()
  
  if (error) {
    console.error('❌ Error inserting students:', error.message)
    return null
  }
  
  console.log(`✅ Inserted ${data.length} students`)
  return data
}

async function insertClasses() {
  console.log('📚 Inserting classes...')
  
  const { data, error } = await supabase
    .from('classes')
    .insert(sampleClasses)
    .select()
  
  if (error) {
    console.error('❌ Error inserting classes:', error.message)
    return null
  }
  
  console.log(`✅ Inserted ${data.length} classes`)
  return data
}

async function createClassAssignments(students, classes) {
  console.log('🔗 Creating class assignments...')
  
  const assignments = []
  
  // Create realistic assignments - each student enrolled in 3-5 classes
  for (const student of students) {
    const numClasses = Math.floor(Math.random() * 3) + 3 // 3-5 classes
    const shuffledClasses = [...classes].sort(() => 0.5 - Math.random())
    const assignedClasses = shuffledClasses.slice(0, numClasses)
    
    for (const classItem of assignedClasses) {
      assignments.push({
        student_id: student.id,
        class_id: classItem.id
      })
    }
  }
  
  const { data, error } = await supabase
    .from('class_assignments')
    .insert(assignments)
    .select()
  
  if (error) {
    console.error('❌ Error creating class assignments:', error.message)
    return null
  }
  
  console.log(`✅ Created ${data.length} class assignments`)
  return data
}

async function fillDatabase() {
  try {
    console.log('🚀 Starting database fill process...')
    console.log(`📡 Connecting to: ${supabaseUrl}`)
    
    // Test connection
    const { error: testError } = await supabase.from('students').select('count', { count: 'exact', head: true })
    if (testError) {
      throw new Error(`Connection failed: ${testError.message}`)
    }
    console.log('✅ Connection successful')
    
    // Clear existing data
    const cleared = await clearDatabase()
    if (!cleared) {
      throw new Error('Failed to clear database')
    }
    
    // Insert students
    const students = await insertStudents()
    if (!students) {
      throw new Error('Failed to insert students')
    }
    
    // Insert classes
    const classes = await insertClasses()
    if (!classes) {
      throw new Error('Failed to insert classes')
    }
    
    // Create class assignments
    const assignments = await createClassAssignments(students, classes)
    if (!assignments) {
      throw new Error('Failed to create class assignments')
    }
    
    console.log('🎉 Database filled successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Students: ${students.length}`)
    console.log(`   - Classes: ${classes.length}`)
    console.log(`   - Assignments: ${assignments.length}`)
    
    return true
  } catch (error) {
    console.error('💥 Error filling database:', error.message)
    return false
  }
}

// Run the script
fillDatabase().then((success) => {
  process.exit(success ? 0 : 1)
})
