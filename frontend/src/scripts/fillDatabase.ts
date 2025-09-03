import { supabase } from '../services/supabase'

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

    // Clear in order due to foreign key constraints
    const { error: assignmentsError } = await supabase
        .from('class_assignments')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (assignmentsError) {
        console.error('❌ Error clearing class assignments:', assignmentsError)
        return false
    }

    const { error: studentsError } = await supabase
        .from('students')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (studentsError) {
        console.error('❌ Error clearing students:', studentsError)
        return false
    }

    const { error: classesError } = await supabase
        .from('classes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (classesError) {
        console.error('❌ Error clearing classes:', classesError)
        return false
    }

    console.log('✅ Database cleared successfully')
    return true
}

async function insertStudents() {
    console.log('👥 Inserting students...')

    const { data, error } = await supabase
        .from('students')
        .insert(sampleStudents)
        .select()

    if (error) {
        console.error('❌ Error inserting students:', error)
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
        console.error('❌ Error inserting classes:', error)
        return null
    }

    console.log(`✅ Inserted ${data.length} classes`)
    return data
}

async function createClassAssignments(students: any[], classes: any[]) {
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
        console.error('❌ Error creating class assignments:', error)
        return null
    }

    console.log(`✅ Created ${data.length} class assignments`)
    return data
}

async function fillDatabase() {
    try {
        console.log('🚀 Starting database fill process...')

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
        console.error('💥 Error filling database:', error)
        return false
    }
}

// Export for use in other scripts
export { fillDatabase, clearDatabase }

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    fillDatabase().then((success) => {
        process.exit(success ? 0 : 1)
    })
}
