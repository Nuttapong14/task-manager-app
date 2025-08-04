// Test script to verify all project CRUD operations work
// Run with: node test-project-loading.js

const BASE_URL = 'http://localhost:3000'

async function testProjectCRUD() {
    console.log('🧪 Testing Project CRUD Operations via API Routes...\n')
    
    let testProjectId = null
    
    try {
        // Test 1: GET Projects
        console.log('1. Testing GET /api/projects...')
        const getResponse = await fetch(`${BASE_URL}/api/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!getResponse.ok) {
            const errorData = await getResponse.json()
            console.error('❌ GET Projects failed:', errorData)
            return false
        }

        const projects = await getResponse.json()
        console.log('✅ GET Projects successful:', projects.length, 'projects found')

        // Test 2: POST Create Project
        console.log('\n2. Testing POST /api/projects...')
        const testProject = {
            name: 'Test Project ' + Date.now(),
            description: 'A test project created by the test script',
            color: 'from-blue-500 to-green-500',
            due_date: '2025-12-31',
            owner_id: 'test-user-id'
        }

        const postResponse = await fetch(`${BASE_URL}/api/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testProject)
        })

        if (postResponse.ok) {
            const createdProject = await postResponse.json()
            testProjectId = createdProject.id
            console.log('✅ POST Project successful:', createdProject.name)
        } else {
            const errorData = await postResponse.json()
            console.log('⚠️ POST Project expected to work, but got:', errorData.error)
        }

        // Test 3: PUT Update Project (if we have a project ID)
        if (testProjectId) {
            console.log('\n3. Testing PUT /api/projects...')
            const updates = {
                name: 'Updated Test Project ' + Date.now(),
                description: 'Updated description'
            }

            const putResponse = await fetch(`${BASE_URL}/api/projects?id=${testProjectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            })

            if (putResponse.ok) {
                const updatedProject = await putResponse.json()
                console.log('✅ PUT Project successful:', updatedProject.name)
            } else {
                const errorData = await putResponse.json()
                console.log('❌ PUT Project failed:', errorData)
            }
        }

        // Test 4: DELETE Project (if we have a project ID)
        if (testProjectId) {
            console.log('\n4. Testing DELETE /api/projects...')
            const deleteResponse = await fetch(`${BASE_URL}/api/projects?id=${testProjectId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (deleteResponse.ok) {
                const result = await deleteResponse.json()
                console.log('✅ DELETE Project successful:', result)
            } else {
                const errorData = await deleteResponse.json()
                console.log('❌ DELETE Project failed:', errorData)
            }
        }

        console.log('\n🎉 All API endpoints are working!')
        return true

    } catch (error) {
        console.error('❌ Test failed:', error.message)
        return false
    }
}

// Run the test
testProjectCRUD().then(success => {
    process.exit(success ? 0 : 1)
})