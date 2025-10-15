'use client'

import { signIn } from '@/app/actions/auth';
import { useState } from 'react';
import Link from "next/link";

export default function LogIn() {
const [error, setError] = useState(null)
const [loading, setLoading] = useState(false)

async function handleSubmit(e) {
  e.preventDefault()
  setLoading(true)
  setError(null)

  const formData = new FormData(e.currentTarget)
  const result = await signIn(formData)

  if (result?.error) {
    setError(result.error)
    setLoading(false)
  }
}

    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              alt="Your Company"
              src="/milli.svg"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63] sm:text-sm/6"
                    />
                  </div>
                </div>
  
                <div>
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63] sm:text-sm/6"
                    />
                  </div>
                </div>
  
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-6 shrink-0 items-center">
                      <div className="group grid size-4 grid-cols-1">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-[#00bf63] checked:bg-[#00bf63] indeterminate:border-[#00bf63] indeterminate:bg-[#00bf63] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bf63] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        />
                        <svg
                          fill="none"
                          viewBox="0 0 14 14"
                          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-[:checked]:opacity-100"
                          />
                          <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-[:indeterminate]:opacity-100"
                          />
                        </svg>
                      </div>
                    </div>
                    <label htmlFor="remember-me" className="block text-sm/6 text-gray-900">
                      Remember me
                    </label>
                  </div>
  
                  <div className="text-sm/6">
                    <a href="#" className="font-semibold text-[#00bf63] hover:text-[#33d98a]">
                      Forgot password?
                    </a>
                  </div>
                </div>

               {error && (
                <div className='rounded-md bg-red-50 p-4'>
                  <p className='text-sm text-red-800'>{error}</p>
                </div>
               )}
  
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-[#00bf63] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#33d98a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bf63]"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
  
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Don't have an account yet?{' '}
              <Link href="/signup" className="font-semibold text-[#00bf63] hover:text-[#33d98a]">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </>
    )
  }
  