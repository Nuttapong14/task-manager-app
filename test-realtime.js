// Test script to create/update/delete data and verify real-time updates
// Run with: node test-realtime.js

const BASE_URL = 'http://localhost:3001'

async function testRealTimeUpdates() {
    console.log('🚀 Testing Real-Time Updates...\n')
    
    try {
        // Test 1: Create a project to trigger real-time update
        console.log('1. Creating a project to test real-time updates...')
        const testProject = {
            name: 'Real-Time Test Project ' + Date.now(),
            description: 'Testing real-time functionality',
            color: 'from-blue-500 to-green-500',
            due_date: '2025-12-31',
            owner_id: 'eaf805a1-4fd1-4b08-a8f7-795d9cb99bc0' // User ID from logs
        }

        const response = await fetch(`${BASE_URL}/api/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testProject)
        })

        if (response.ok) {
            const createdProject = await response.json()
            console.log('✅ Project created:', createdProject.name)
            console.log('📡 Check browser console for real-time update logs!')
            
            // Wait a bit then update the project
            setTimeout(async () => {
                console.log('\n2. Updating project to test real-time updates...')
                const updateResponse = await fetch(`${BASE_URL}/api/projects?id=${createdProject.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: 'Updated Real-Time Test Project ' + Date.now(),
                        description: 'Updated via real-time test'
                    })
                })

                if (updateResponse.ok) {
                    console.log('✅ Project updated - check browser for real-time update!')
                } else {
                    console.log('❌ Project update failed')
                }

                // Wait a bit then delete the project
                setTimeout(async () => {
                    console.log('\n3. Deleting project to test real-time updates...')
                    const deleteResponse = await fetch(`${BASE_URL}/api/projects?id=${createdProject.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })

                    if (deleteResponse.ok) {
                        console.log('✅ Project deleted - check browser for real-time update!')
                    } else {
                        console.log('❌ Project deletion failed')
                    }
                }, 2000)
            }, 2000)

        } else {
            const errorData = await response.json()
            console.log('❌ Project creation failed:', errorData.error)
        }
    } catch (error) {
        console.error('❌ Test failed:', error.message)
    }
}

console.log('📱 Make sure you have the app open in your browser at http://localhost:3001')
console.log('👀 Watch the browser console for real-time update logs!\n')

// Run the test
testRealTimeUpdates()