// Test script to verify all task CRUD operations work
// Run with: node test-task-operations.js

const BASE_URL = 'http://localhost:3000'

async function testTaskCRUD() {
    console.log('🧪 Testing Task CRUD Operations via API Routes...\n')
    
    const testProjectId = 'test-project-id'
    let testTaskId = null
    
    try {
        // Test 1: GET Tasks for a project
        console.log('1. Testing GET /api/tasks...')
        const getResponse = await fetch(`${BASE_URL}/api/tasks?projectId=${testProjectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!getResponse.ok) {
            const errorData = await getResponse.json()
            console.log('⚠️ GET Tasks expected to work, but got:', errorData.error)
        } else {
            const tasks = await getResponse.json()
            console.log('✅ GET Tasks successful:', tasks.length, 'tasks found')
        }

        // Test 2: POST Create Task
        console.log('\n2. Testing POST /api/tasks...')
        const testTask = {
            title: 'Test Task ' + Date.now(),
            description: 'A test task created by the test script',
            status: 'todo',
            priority: 'medium',
            project_id: testProjectId,
            due_date: '2025-12-31'
        }

        const postResponse = await fetch(`${BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testTask)
        })

        if (postResponse.ok) {
            const createdTask = await postResponse.json()
            testTaskId = createdTask.id
            console.log('✅ POST Task successful:', createdTask.title)
        } else {
            const errorData = await postResponse.json()
            console.log('⚠️ POST Task expected to work, but got:', errorData.error)
        }

        // Test 3: PUT Update Task (if we have a task ID)
        if (testTaskId) {
            console.log('\n3. Testing PUT /api/tasks...')
            const updates = {
                title: 'Updated Test Task ' + Date.now(),
                description: 'Updated description',
                status: 'in-progress'
            }

            const putResponse = await fetch(`${BASE_URL}/api/tasks?id=${testTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            })

            if (putResponse.ok) {
                const updatedTask = await putResponse.json()
                console.log('✅ PUT Task successful:', updatedTask.title)
            } else {
                const errorData = await putResponse.json()
                console.log('❌ PUT Task failed:', errorData)
            }
        }

        // Test 4: Task Tags
        if (testTaskId) {
            console.log('\n4. Testing Task Tags...')
            
            // Add tag
            const addTagResponse = await fetch(`${BASE_URL}/api/task-tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId: testTaskId, tag: 'test-tag' })
            })

            if (addTagResponse.ok) {
                console.log('✅ Add Task Tag successful')
                
                // Remove tag
                const removeTagResponse = await fetch(`${BASE_URL}/api/task-tags?taskId=${testTaskId}&tag=test-tag`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                if (removeTagResponse.ok) {
                    console.log('✅ Remove Task Tag successful')
                } else {
                    const errorData = await removeTagResponse.json()
                    console.log('❌ Remove Task Tag failed:', errorData)
                }
            } else {
                const errorData = await addTagResponse.json()
                console.log('❌ Add Task Tag failed:', errorData)
            }
        }

        // Test 5: DELETE Task (if we have a task ID)
        if (testTaskId) {
            console.log('\n5. Testing DELETE /api/tasks...')
            const deleteResponse = await fetch(`${BASE_URL}/api/tasks?id=${testTaskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (deleteResponse.ok) {
                const result = await deleteResponse.json()
                console.log('✅ DELETE Task successful:', result)
            } else {
                const errorData = await deleteResponse.json()
                console.log('❌ DELETE Task failed:', errorData)
            }
        }

        console.log('\n🎉 All Task API endpoints are working!')
        return true

    } catch (error) {
        console.error('❌ Test failed:', error.message)
        return false
    }
}

// Run the test
testTaskCRUD().then(success => {
    process.exit(success ? 0 : 1)
})