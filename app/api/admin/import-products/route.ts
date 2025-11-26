import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    // Verify Supabase connection
    const supabase = createAdminClient()
    const { error: testError } = await supabase.from('products').select('id').limit(1)
    
    if (testError) {
      return NextResponse.json({ 
        error: 'Database connection failed. Please check your Supabase credentials.',
        details: testError.message 
      }, { status: 500 })
    }

    // Check if script file exists
    const scriptPath = path.join(process.cwd(), 'scripts', 'import-products.js')
    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ 
        error: 'Import script not found' 
      }, { status: 404 })
    }

    // Run the import script
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    })

    return NextResponse.json({ 
      success: true,
      message: 'Products imported successfully',
      output: stdout,
      errors: stderr || null,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to import products',
      details: error.stderr || error.stdout || null,
    }, { status: 500 })
  }
}

