<template>
  <div class="min-h-screen bg-black text-white flex flex-col">
    <!-- Login Screen (shown when not authenticated) -->
    <div
      v-if="!user"
      class="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div class="w-full max-w-md">
        <div class="flex justify-center mb-8">
          <Music class="w-16 h-16 text-green-500" />
        </div>
        <h1 class="text-3xl font-bold text-center mb-8">Spotify Clone</h1>

        <div class="bg-zinc-900 rounded-lg p-6 shadow-lg">
          <h2 class="text-xl font-semibold mb-6">
            {{ isLogin ? "Login" : "Sign Up" }}
          </h2>

          <form
            @submit.prevent="isLogin ? login() : signup()"
            class="space-y-4"
          >
            <div v-if="!isLogin" class="space-y-2">
              <label for="name" class="block text-sm font-medium">Name</label>
              <input
                type="text"
                id="name"
                v-model="name"
                class="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your name"
              />
            </div>

            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="your@email.com"
              />
            </div>

            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium"
                >Password</label
              >
              <input
                type="password"
                id="password"
                v-model="password"
                class="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              class="w-full py-2 px-4 bg-green-500 hover:bg-green-600 rounded font-medium transition-colors"
            >
              {{ isLogin ? "Login" : "Sign Up" }}
            </button>

            <div v-if="authError" class="text-red-500 text-sm mt-2">
              {{ authError }}
            </div>
          </form>

          <div class="mt-6 text-center">
            <button
              @click="isLogin = !isLogin"
              class="text-sm text-green-500 hover:underline"
            >
              {{
                isLogin
                  ? "Need an account? Sign up"
                  : "Already have an account? Login"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main App (shown when authenticated) -->
    <div v-else class="flex flex-col h-screen">
      <!-- Top Navigation -->
      <header class="bg-zinc-900 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="showSidebar = !showSidebar" class="md:hidden mr-4">
            <Menu class="w-6 h-6" />
          </button>
          <div class="flex items-center gap-4">
            <ChevronLeft @click="goBack" class="w-5 h-5 cursor-pointer" />
            <ChevronRight @click="goForward" class="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        <div class="relative max-w-md w-full mx-4 hidden md:block">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search for songs, artists, or albums"
            class="w-full pl-10 pr-4 py-2 bg-zinc-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 bg-zinc-800 rounded-full p-1 pr-3 hover:bg-zinc-700"
          >
            <div
              class="w-7 h-7 rounded-full bg-zinc-600 flex items-center justify-center"
            >
              <User class="w-4 h-4" />
            </div>
            <span class="text-sm font-medium">{{
              user.displayName || "User"
            }}</span>
            <ChevronDown class="w-4 h-4" />
          </button>

          <div
            v-if="showUserMenu"
            class="absolute right-6 top-16 bg-zinc-800 rounded-md shadow-lg p-2 z-10"
          >
            <button
              @click="logout"
              class="w-full text-left px-3 py-2 hover:bg-zinc-700 rounded text-sm"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <aside
          :class="`bg-black w-64 flex-shrink-0 overflow-y-auto transition-all duration-300 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`"
        >
          <div class="p-6">
            <div class="flex items-center gap-2 mb-8">
              <Music class="w-8 h-8 text-green-500" />
              <span class="text-xl font-bold">Spotify</span>
            </div>

            <nav class="space-y-6">
              <div>
                <h3 class="text-xs uppercase text-zinc-400 font-bold mb-2">
                  Menu
                </h3>
                <ul class="space-y-2">
                  <li>
                    <button
                      @click="currentView = 'home'"
                      :class="`flex items-center gap-3 w-full p-2 rounded-md ${
                        currentView === 'home'
                          ? 'bg-zinc-800'
                          : 'hover:bg-zinc-800'
                      }`"
                    >
                      <Home class="w-5 h-5" />
                      <span>Home</span>
                    </button>
                  </li>
                  <li>
                    <button
                      @click="
                        currentView = 'search';
                        showSearchBar = true;
                      "
                      :class="`flex items-center gap-3 w-full p-2 rounded-md ${
                        currentView === 'search'
                          ? 'bg-zinc-800'
                          : 'hover:bg-zinc-800'
                      }`"
                    >
                      <Search class="w-5 h-5" />
                      <span>Search</span>
                    </button>
                  </li>
                  <li>
                    <button
                      @click="currentView = 'library'"
                      :class="`flex items-center gap-3 w-full p-2 rounded-md ${
                        currentView === 'library'
                          ? 'bg-zinc-800'
                          : 'hover:bg-zinc-800'
                      }`"
                    >
                      <Library class="w-5 h-5" />
                      <span>Your Library</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="text-xs uppercase text-zinc-400 font-bold mb-2">
                  Playlists
                </h3>
                <ul class="space-y-2">
                  <li>
                    <button
                      @click="createPlaylist"
                      class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-zinc-800"
                    >
                      <PlusSquare class="w-5 h-5" />
                      <span>Create Playlist</span>
                    </button>
                  </li>
                  <li>
                    <button
                      @click="currentView = 'liked'"
                      :class="`flex items-center gap-3 w-full p-2 rounded-md ${
                        currentView === 'liked'
                          ? 'bg-zinc-800'
                          : 'hover:bg-zinc-800'
                      }`"
                    >
                      <Heart class="w-5 h-5 text-green-500" />
                      <span>Liked Songs</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div v-if="userPlaylists.length > 0">
                <ul class="space-y-2">
                  <li v-for="playlist in userPlaylists" :key="playlist.id">
                    <button
                      @click="openPlaylist(playlist)"
                      class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-zinc-800 text-left"
                    >
                      <span class="truncate">{{ playlist.name }}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </aside>

        <!-- Mobile Search Bar -->
        <div
          v-if="showSearchBar"
          class="absolute top-16 left-0 right-0 bg-zinc-900 p-4 z-10 md:hidden"
        >
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Search for songs, artists, or albums"
              class="w-full pl-10 pr-4 py-2 bg-zinc-800 rounded-full text-sm focus:outline-none"
            />
          </div>
        </div>

        <!-- Main Content -->
        <main
          class="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-800 to-black p-6"
        >
          <!-- Home View -->
          <div v-if="currentView === 'home'">
            <h1 class="text-3xl font-bold mb-6">Good {{ timeOfDay }}</h1>

            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
            >
              <button
                v-for="item in recentlyPlayed"
                :key="item.id"
                @click="playItem(item)"
                class="flex items-center bg-zinc-800/50 hover:bg-zinc-700/50 rounded-md overflow-hidden"
              >
                <img
                  :src="item.image"
                  alt="Album cover"
                  class="w-12 h-12 object-cover"
                />
                <span class="ml-4 font-medium truncate">{{ item.name }}</span>
              </button>
            </div>

            <h2 class="text-2xl font-bold mb-4">Made for you</h2>
            <div
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8"
            >
              <div
                v-for="item in recommendations"
                :key="item.id"
                @click="playItem(item)"
                class="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-colors cursor-pointer"
              >
                <div class="relative mb-4 group">
                  <img
                    :src="item.image"
                    alt="Album cover"
                    class="w-full aspect-square object-cover rounded-md shadow-lg"
                  />
                  <button
                    @click.stop="playItem(item)"
                    class="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play class="w-5 h-5 text-black" />
                  </button>
                </div>
                <h3 class="font-medium truncate">{{ item.name }}</h3>
                <p class="text-sm text-zinc-400 truncate">{{ item.artist }}</p>
              </div>
            </div>

            <h2 class="text-2xl font-bold mb-4">Recently Released</h2>
            <div
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              <div
                v-for="item in newReleases"
                :key="item.id"
                @click="playItem(item)"
                class="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-colors cursor-pointer"
              >
                <div class="relative mb-4 group">
                  <img
                    :src="item.image"
                    alt="Album cover"
                    class="w-full aspect-square object-cover rounded-md shadow-lg"
                  />
                  <button
                    @click.stop="playItem(item)"
                    class="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play class="w-5 h-5 text-black" />
                  </button>
                </div>
                <h3 class="font-medium truncate">{{ item.name }}</h3>
                <p class="text-sm text-zinc-400 truncate">{{ item.artist }}</p>
              </div>
            </div>
          </div>

          <!-- Search View -->
          <div v-else-if="currentView === 'search'">
            <h1 class="text-3xl font-bold mb-6">Search</h1>

            <div v-if="searchResults.length > 0">
              <h2 class="text-2xl font-bold mb-4">Top result</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div
                  class="bg-zinc-800/40 p-6 rounded-lg hover:bg-zinc-700/40 transition-colors"
                >
                  <img
                    :src="searchResults[0].image"
                    alt="Album cover"
                    class="w-24 h-24 rounded-md shadow-lg mb-4"
                  />
                  <h3 class="text-2xl font-bold mb-1">
                    {{ searchResults[0].name }}
                  </h3>
                  <p class="text-sm text-zinc-400 mb-4">
                    {{ searchResults[0].artist }}
                  </p>
                  <button
                    @click="playItem(searchResults[0])"
                    class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Play class="w-5 h-5 text-black" />
                  </button>
                </div>
              </div>

              <h2 class="text-2xl font-bold mb-4">Songs</h2>
              <div class="bg-zinc-800/20 rounded-md overflow-hidden mb-8">
                <table class="w-full">
                  <thead class="border-b border-zinc-700">
                    <tr>
                      <th
                        class="px-4 py-2 text-left text-sm font-medium text-zinc-400"
                      >
                        #
                      </th>
                      <th
                        class="px-4 py-2 text-left text-sm font-medium text-zinc-400"
                      >
                        Title
                      </th>
                      <th
                        class="px-4 py-2 text-left text-sm font-medium text-zinc-400 hidden md:table-cell"
                      >
                        Album
                      </th>
                      <th
                        class="px-4 py-2 text-left text-sm font-medium text-zinc-400 hidden lg:table-cell"
                      >
                        Date added
                      </th>
                      <th
                        class="px-4 py-2 text-right text-sm font-medium text-zinc-400"
                      >
                        <Clock class="w-5 h-5 inline-block" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(track, index) in searchResults.slice(0, 5)"
                      :key="track.id"
                      class="hover:bg-zinc-700/30 group"
                    >
                      <td class="px-4 py-3 text-zinc-400">
                        <div class="flex items-center">
                          <span class="group-hover:hidden">{{
                            index + 1
                          }}</span>
                          <Play
                            class="w-4 h-4 hidden group-hover:block cursor-pointer"
                            @click="playItem(track)"
                          />
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex items-center">
                          <img
                            :src="track.image"
                            alt="Album cover"
                            class="w-10 h-10 mr-3 rounded"
                          />
                          <div>
                            <div class="font-medium">{{ track.name }}</div>
                            <div class="text-sm text-zinc-400">
                              {{ track.artist }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-zinc-400 hidden md:table-cell">
                        {{ track.album }}
                      </td>
                      <td class="px-4 py-3 text-zinc-400 hidden lg:table-cell">
                        {{ track.dateAdded }}
                      </td>
                      <td class="px-4 py-3 text-zinc-400 text-right">
                        {{ track.duration }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-2xl font-bold mb-4">Albums</h2>
              <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              >
                <div
                  v-for="item in searchResults.slice(0, 6)"
                  :key="`album-${item.id}`"
                  @click="playItem(item)"
                  class="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-colors cursor-pointer"
                >
                  <div class="relative mb-4 group">
                    <img
                      :src="item.image"
                      alt="Album cover"
                      class="w-full aspect-square object-cover rounded-md shadow-lg"
                    />
                    <button
                      @click.stop="playItem(item)"
                      class="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play class="w-5 h-5 text-black" />
                    </button>
                  </div>
                  <h3 class="font-medium truncate">{{ item.name }}</h3>
                  <p class="text-sm text-zinc-400 truncate">
                    {{ item.artist }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-else-if="searchQuery"
              class="flex flex-col items-center justify-center py-12"
            >
              <Search class="w-16 h-16 text-zinc-600 mb-4" />
              <h2 class="text-2xl font-bold mb-2">
                No results found for "{{ searchQuery }}"
              </h2>
              <p class="text-zinc-400">
                Please check your spelling or try different keywords
              </p>
            </div>

            <div v-else>
              <h2 class="text-2xl font-bold mb-4">Browse all</h2>
              <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                <div
                  v-for="(category, index) in categories"
                  :key="index"
                  class="relative overflow-hidden rounded-lg aspect-square cursor-pointer"
                  :style="{ backgroundColor: category.color }"
                >
                  <h3 class="p-4 text-2xl font-bold">{{ category.name }}</h3>
                  <img
                    :src="category.image"
                    alt="Category"
                    class="absolute bottom-0 right-0 w-1/2 h-1/2 transform rotate-25 translate-x-1/8 translate-y-1/8 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Library View -->
          <div v-else-if="currentView === 'library'">
            <div class="flex items-center justify-between mb-6">
              <h1 class="text-3xl font-bold">Your Library</h1>
              <button class="p-2 rounded-full hover:bg-zinc-800">
                <Plus class="w-6 h-6" />
              </button>
            </div>

            <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                class="px-3 py-1.5 rounded-full bg-zinc-800 text-sm font-medium whitespace-nowrap"
              >
                Playlists
              </button>
              <button
                class="px-3 py-1.5 rounded-full bg-zinc-800 text-sm font-medium whitespace-nowrap"
              >
                Artists
              </button>
              <button
                class="px-3 py-1.5 rounded-full bg-zinc-800 text-sm font-medium whitespace-nowrap"
              >
                Albums
              </button>
              <button
                class="px-3 py-1.5 rounded-full bg-zinc-800 text-sm font-medium whitespace-nowrap"
              >
                Podcasts & Shows
              </button>
            </div>

            <div class="grid gap-2">
              <div
                v-for="playlist in userPlaylists"
                :key="`lib-${playlist.id}`"
                @click="openPlaylist(playlist)"
                class="flex items-center p-2 hover:bg-zinc-800/50 rounded-md cursor-pointer"
              >
                <div
                  class="w-12 h-12 bg-zinc-700 rounded flex items-center justify-center mr-3"
                >
                  <Music class="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                  <h3 class="font-medium">{{ playlist.name }}</h3>
                  <p class="text-sm text-zinc-400">
                    Playlist • {{ user.displayName }}
                  </p>
                </div>
              </div>

              <div
                @click="currentView = 'liked'"
                class="flex items-center p-2 hover:bg-zinc-800/50 rounded-md cursor-pointer"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-300 rounded flex items-center justify-center mr-3"
                >
                  <Heart class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 class="font-medium">Liked Songs</h3>
                  <p class="text-sm text-zinc-400">
                    Playlist • {{ likedSongs.length }} songs
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Liked Songs View -->
          <div v-else-if="currentView === 'liked'">
            <div
              class="flex items-end h-64 bg-gradient-to-b from-purple-700 to-zinc-900 mb-6 p-6"
            >
              <div class="flex items-center gap-6">
                <div
                  class="w-40 h-40 bg-gradient-to-br from-purple-700 to-blue-300 rounded-md shadow-lg flex items-center justify-center"
                >
                  <Heart class="w-16 h-16 text-white" />
                </div>
                <div>
                  <p class="text-sm font-medium mb-2">Playlist</p>
                  <h1 class="text-5xl font-bold mb-4">Liked Songs</h1>
                  <p class="text-sm">
                    <span class="font-medium">{{ user.displayName }}</span> •
                    <span>{{ likedSongs.length }} songs</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-6 mb-6">
              <button
                @click="isPlaying = !isPlaying"
                class="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <component
                  :is="isPlaying ? Pause : Play"
                  class="w-7 h-7 text-black"
                />
              </button>

              <button class="text-zinc-400 hover:text-white">
                <Heart class="w-8 h-8 text-green-500" fill="#22c55e" />
              </button>

              <button class="text-zinc-400 hover:text-white">
                <MoreHorizontal class="w-6 h-6" />
              </button>
            </div>

            <div class="bg-zinc-800/20 rounded-md overflow-hidden">
              <table class="w-full">
                <thead class="border-b border-zinc-700">
                  <tr>
                    <th
                      class="px-4 py-2 text-left text-sm font-medium text-zinc-400"
                    >
                      #
                    </th>
                    <th
                      class="px-4 py-2 text-left text-sm font-medium text-zinc-400"
                    >
                      Title
                    </th>
                    <th
                      class="px-4 py-2 text-left text-sm font-medium text-zinc-400 hidden md:table-cell"
                    >
                      Album
                    </th>
                    <th
                      class="px-4 py-2 text-left text-sm font-medium text-zinc-400 hidden lg:table-cell"
                    >
                      Date added
                    </th>
                    <th
                      class="px-4 py-2 text-right text-sm font-medium text-zinc-400"
                    >
                      <Clock class="w-5 h-5 inline-block" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(track, index) in likedSongs"
                    :key="`liked-${track.id}`"
                    class="hover:bg-zinc-700/30 group"
                  >
                    <td class="px-4 py-3 text-zinc-400">
                      <div class="flex items-center">
                        <span class="group-hover:hidden">{{ index + 1 }}</span>
                        <Play
                          class="w-4 h-4 hidden group-hover:block cursor-pointer"
                          @click="playItem(track)"
                        />
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center">
                        <img
                          :src="track.image"
                          alt="Album cover"
                          class="w-10 h-10 mr-3 rounded"
                        />
                        <div>
                          <div class="font-medium">{{ track.name }}</div>
                          <div class="text-sm text-zinc-400">
                            {{ track.artist }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-zinc-400 hidden md:table-cell">
                      {{ track.album }}
                    </td>
                    <td class="px-4 py-3 text-zinc-400 hidden lg:table-cell">
                      {{ track.dateAdded }}
                    </td>
                    <td class="px-4 py-3 text-zinc-400 text-right">
                      {{ track.duration }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Playlist View -->
          <div v-else-if="currentView === 'playlist' && currentPlaylist">
            <div
              class="flex items-end h-64 bg-gradient-to-b from-green-700 to-zinc-900 mb-6 p-6"
            >
              <div class="flex items-center gap-6">
                <div
                  class="w-40 h-40 bg-zinc-800 rounded-md shadow-lg flex items-center justify-center"
                >
                  <Music class="w-16 h-16 text-zinc-600" />
                </div>
                <div>
                  <p class="text-sm font-medium mb-2">Playlist</p>
                  <h1 class="text-5xl font-bold mb-4">
                    {{ currentPlaylist.name }}
                  </h1>
                  <p class="text-sm">
                    <span class="font-medium">{{ user.displayName }}</span> •
                    <span>{{ currentPlaylist.tracks.length }} songs</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-6 mb-6">
              <button
                @click="isPlaying = !isPlaying"
                class="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <component
                  :is="isPlaying ? Pause : Play"
                  class="w-7 h-7 text-black"
                />
              </button>

              <button class="text-zinc-400 hover:text-white">
                <Heart
                  class="w-8 h-8"
                  :class="isPlaylistLiked ? 'text-green-500' : ''"
                  :fill="isPlaylistLiked ? '#22c55e' : 'none'"
                  @click="toggleLikePlaylist"
                />
              </button>

              <button class="text-zinc-400 hover:text-white">
                <MoreHorizontal class="w-6 h-6" />
              </button>
            </div>

            <div class="bg-zinc-800/20 rounded-md overflow-hidden">
              <table class="w-full">
                <thead class="border-b border-zinc-700">
                  <tr>
                    <th
                      class="px-4 py-2 text-left text-sm font-medium text-zinc-400"
                    >
                      #
                    </th>
                    <th
                      class="px-4 py-2 text-left text-sm font-medium text-zinc-400"
                    >
                      Title
                    </th>
                    <th
                      class="px-4 py-2 text-left text-sm font-medium text-zinc-400 hidden md:table-cell"
                    >
                      Album
                    </th>
                    <th
                      class="px-4 py-2 text-left text-sm font-medium text-zinc-400 hidden lg:table-cell"
                    >
                      Date added
                    </th>
                    <th
                      class="px-4 py-2 text-right text-sm font-medium text-zinc-400"
                    >
                      <Clock class="w-5 h-5 inline-block" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(track, index) in currentPlaylist.tracks"
                    :key="`playlist-${track.id}`"
                    class="hover:bg-zinc-700/30 group"
                  >
                    <td class="px-4 py-3 text-zinc-400">
                      <div class="flex items-center">
                        <span class="group-hover:hidden">{{ index + 1 }}</span>
                        <Play
                          class="w-4 h-4 hidden group-hover:block cursor-pointer"
                          @click="playItem(track)"
                        />
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center">
                        <img
                          :src="track.image"
                          alt="Album cover"
                          class="w-10 h-10 mr-3 rounded"
                        />
                        <div>
                          <div class="font-medium">{{ track.name }}</div>
                          <div class="text-sm text-zinc-400">
                            {{ track.artist }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-zinc-400 hidden md:table-cell">
                      {{ track.album }}
                    </td>
                    <td class="px-4 py-3 text-zinc-400 hidden lg:table-cell">
                      {{ track.dateAdded }}
                    </td>
                    <td class="px-4 py-3 text-zinc-400 text-right">
                      {{ track.duration }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <!-- Player -->
      <footer class="bg-zinc-900 border-t border-zinc-800 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center w-1/3">
            <div v-if="currentTrack" class="flex items-center">
              <img
                :src="currentTrack.image"
                alt="Album cover"
                class="w-14 h-14 mr-3 rounded"
              />
              <div>
                <div class="font-medium">{{ currentTrack.name }}</div>
                <div class="text-sm text-zinc-400">
                  {{ currentTrack.artist }}
                </div>
              </div>
              <button class="ml-4 text-zinc-400 hover:text-white">
                <Heart
                  class="w-5 h-5"
                  :class="isTrackLiked ? 'text-green-500' : ''"
                  :fill="isTrackLiked ? '#22c55e' : 'none'"
                  @click="toggleLikeSong"
                />
              </button>
            </div>
          </div>

          <div class="flex flex-col items-center w-1/3">
            <div class="flex items-center gap-4 mb-2">
              <button class="text-zinc-400 hover:text-white">
                <Shuffle class="w-5 h-5" />
              </button>
              <button class="text-zinc-400 hover:text-white">
                <SkipBack class="w-5 h-5" />
              </button>
              <button
                @click="isPlaying = !isPlaying"
                class="w-8 h-8 bg-white rounded-full flex items-center justify-center"
              >
                <component
                  :is="isPlaying ? Pause : Play"
                  class="w-4 h-4 text-black"
                />
              </button>
              <button class="text-zinc-400 hover:text-white">
                <SkipForward class="w-5 h-5" />
              </button>
              <button class="text-zinc-400 hover:text-white">
                <Repeat class="w-5 h-5" />
              </button>
            </div>

            <div class="flex items-center gap-2 w-full">
              <span class="text-xs text-zinc-400">{{
                formatTime(currentTime)
              }}</span>
              <div class="flex-1 h-1 bg-zinc-700 rounded-full">
                <div
                  class="h-1 bg-white rounded-full"
                  :style="{ width: `${(currentTime / duration) * 100}%` }"
                ></div>
              </div>
              <span class="text-xs text-zinc-400">{{
                formatTime(duration)
              }}</span>
            </div>
          </div>

          <div class="flex items-center justify-end w-1/3 gap-3">
            <button class="text-zinc-400 hover:text-white">
              <Mic2 class="w-5 h-5" />
            </button>
            <button class="text-zinc-400 hover:text-white">
              <ListMusic class="w-5 h-5" />
            </button>
            <button class="text-zinc-400 hover:text-white">
              <Laptop2 class="w-5 h-5" />
            </button>
            <div class="flex items-center gap-1">
              <Volume2 class="w-5 h-5 text-zinc-400" />
              <div class="w-24 h-1 bg-zinc-700 rounded-full">
                <div class="h-1 bg-white rounded-full" style="width: 70%"></div>
              </div>
            </div>
            <button class="text-zinc-400 hover:text-white">
              <Maximize2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Home,
  Search,
  Library,
  PlusSquare,
  Heart,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Mic2,
  ListMusic,
  Laptop2,
  Maximize2,
  Clock,
  Menu,
  Music,
  Plus,
  MoreHorizontal,
} from "lucide-vue-next";

// Firebase imports would go here in a real app
// import { initializeApp } from 'firebase/app'
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
// import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

// Auth state
const user = ref(null);
const isLogin = ref(true);
const name = ref("");
const email = ref("");
const password = ref("");
const authError = ref("");

// UI state
const showSidebar = ref(window.innerWidth >= 768);
const showUserMenu = ref(false);
const showSearchBar = ref(false);
const currentView = ref("home");
const searchQuery = ref("");
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(180); // 3 minutes in seconds
const currentTrack = ref(null);
const currentPlaylist = ref(null);
const isTrackLiked = ref(false);
const isPlaylistLiked = ref(false);

// Mock data (would come from Spotify API and Firebase in a real app)
const recentlyPlayed = ref([
  {
    id: 1,
    name: "Chill Mix",
    image: "https://picsum.photos/id/65/200",
    type: "playlist",
  },
  {
    id: 2,
    name: "Discover Weekly",
    image: "https://picsum.photos/id/68/200",
    type: "playlist",
  },
  {
    id: 3,
    name: "Release Radar",
    image: "https://picsum.photos/id/76/200",
    type: "playlist",
  },
  {
    id: 4,
    name: "Liked Songs",
    image: "https://picsum.photos/id/96/200",
    type: "playlist",
  },
  {
    id: 5,
    name: "Daily Mix 1",
    image: "https://picsum.photos/id/237/200",
    type: "playlist",
  },
  {
    id: 6,
    name: "Daily Mix 2",
    image: "https://picsum.photos/id/239/200",
    type: "playlist",
  },
]);

const recommendations = ref([
  {
    id: 7,
    name: "Lofi Beats",
    artist: "Spotify",
    image: "https://picsum.photos/id/1/200",
    type: "playlist",
  },
  {
    id: 8,
    name: "Peaceful Piano",
    artist: "Spotify",
    image: "https://picsum.photos/id/10/200",
    type: "playlist",
  },
  {
    id: 9,
    name: "Deep Focus",
    artist: "Spotify",
    image: "https://picsum.photos/id/100/200",
    type: "playlist",
  },
  {
    id: 10,
    name: "Instrumental Study",
    artist: "Spotify",
    image: "https://picsum.photos/id/1000/200",
    type: "playlist",
  },
  {
    id: 11,
    name: "Focus Flow",
    artist: "Spotify",
    image: "https://picsum.photos/id/1001/200",
    type: "playlist",
  },
  {
    id: 12,
    name: "Beats to think to",
    artist: "Spotify",
    image: "https://picsum.photos/id/1002/200",
    type: "playlist",
  },
]);

const newReleases = ref([
  {
    id: 13,
    name: "New Album",
    artist: "Popular Artist",
    image: "https://picsum.photos/id/1003/200",
    type: "album",
  },
  {
    id: 14,
    name: "Fresh Hits",
    artist: "Various Artists",
    image: "https://picsum.photos/id/1004/200",
    type: "album",
  },
  {
    id: 15,
    name: "Summer Vibes",
    artist: "Beach Band",
    image: "https://picsum.photos/id/1005/200",
    type: "album",
  },
  {
    id: 16,
    name: "Acoustic Sessions",
    artist: "Indie Artist",
    image: "https://picsum.photos/id/1006/200",
    type: "album",
  },
  {
    id: 17,
    name: "Electronic Dreams",
    artist: "DJ Producer",
    image: "https://picsum.photos/id/1008/200",
    type: "album",
  },
  {
    id: 18,
    name: "Rock Anthems",
    artist: "Rock Band",
    image: "https://picsum.photos/id/1009/200",
    type: "album",
  },
]);

const categories = ref([
  { name: "Pop", color: "#8c67ab", image: "https://picsum.photos/id/1010/200" },
  {
    name: "Hip-Hop",
    color: "#ba5d07",
    image: "https://picsum.photos/id/1011/200",
  },
  {
    name: "Rock",
    color: "#e61e32",
    image: "https://picsum.photos/id/1012/200",
  },
  {
    name: "Dance/Electronic",
    color: "#dc148c",
    image: "https://picsum.photos/id/1013/200",
  },
  { name: "R&B", color: "#148a08", image: "https://picsum.photos/id/1014/200" },
  {
    name: "Indie",
    color: "#8400e7",
    image: "https://picsum.photos/id/1015/200",
  },
  {
    name: "Podcasts",
    color: "#006450",
    image: "https://picsum.photos/id/1016/200",
  },
  {
    name: "Latin",
    color: "#e1118c",
    image: "https://picsum.photos/id/1018/200",
  },
  {
    name: "Mood",
    color: "#777777",
    image: "https://picsum.photos/id/1019/200",
  },
  {
    name: "Workout",
    color: "#ff4632",
    image: "https://picsum.photos/id/1021/200",
  },
]);

const userPlaylists = ref([
  {
    id: 19,
    name: "My Playlist #1",
    tracks: [
      {
        id: 101,
        name: "Song One",
        artist: "Artist A",
        album: "Album X",
        dateAdded: "2 days ago",
        duration: "3:45",
        image: "https://picsum.photos/id/1025/200",
      },
      {
        id: 102,
        name: "Song Two",
        artist: "Artist B",
        album: "Album Y",
        dateAdded: "3 days ago",
        duration: "4:20",
        image: "https://picsum.photos/id/1026/200",
      },
      {
        id: 103,
        name: "Song Three",
        artist: "Artist C",
        album: "Album Z",
        dateAdded: "1 week ago",
        duration: "2:55",
        image: "https://picsum.photos/id/1027/200",
      },
    ],
  },
  {
    id: 20,
    name: "Favorites",
    tracks: [
      {
        id: 104,
        name: "Favorite One",
        artist: "Artist D",
        album: "Album A",
        dateAdded: "1 month ago",
        duration: "3:15",
        image: "https://picsum.photos/id/1028/200",
      },
      {
        id: 105,
        name: "Favorite Two",
        artist: "Artist E",
        album: "Album B",
        dateAdded: "2 weeks ago",
        duration: "4:10",
        image: "https://picsum.photos/id/1029/200",
      },
    ],
  },
]);

const likedSongs = ref([
  {
    id: 106,
    name: "Liked Song One",
    artist: "Artist F",
    album: "Album C",
    dateAdded: "3 weeks ago",
    duration: "3:30",
    image: "https://picsum.photos/id/1031/200",
  },
  {
    id: 107,
    name: "Liked Song Two",
    artist: "Artist G",
    album: "Album D",
    dateAdded: "1 month ago",
    duration: "4:15",
    image: "https://picsum.photos/id/1032/200",
  },
  {
    id: 108,
    name: "Liked Song Three",
    artist: "Artist H",
    album: "Album E",
    dateAdded: "2 months ago",
    duration: "2:45",
    image: "https://picsum.photos/id/1033/200",
  },
]);

const searchResults = ref([]);

// Computed properties
const timeOfDay = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
});

// Methods
const signup = () => {
  // In a real app, this would use Firebase Authentication
  if (!name.value || !email.value || !password.value) {
    authError.value = "Please fill in all fields";
    return;
  }

  // Mock signup
  user.value = {
    uid: "user123",
    email: email.value,
    displayName: name.value,
  };

  resetAuthForm();
};

const login = () => {
  // In a real app, this would use Firebase Authentication
  if (!email.value || !password.value) {
    authError.value = "Please fill in all fields";
    return;
  }

  // Mock login for demo purposes
  user.value = {
    uid: "user123",
    email: email.value,
    displayName: "Imad B.",
  };

  resetAuthForm();
};

const logout = () => {
  // In a real app, this would use Firebase Authentication
  user.value = null;
  showUserMenu.value = false;
};

const resetAuthForm = () => {
  name.value = "";
  email.value = "";
  password.value = "";
  authError.value = "";
};

const handleSearch = () => {
  if (!searchQuery.value) {
    searchResults.value = [];
    return;
  }

  // In a real app, this would call the Spotify API
  // Mock search results
  const query = searchQuery.value.toLowerCase();
  const allItems = [
    ...recommendations.value,
    ...newReleases.value,
    ...likedSongs.value,
    ...userPlaylists.value.flatMap((playlist) => playlist.tracks),
  ];

  searchResults.value = allItems.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      (item.artist && item.artist.toLowerCase().includes(query))
  );
};

const playItem = (item) => {
  currentTrack.value = item;
  isPlaying.value = true;

  // Check if the track is liked
  isTrackLiked.value = likedSongs.value.some((song) => song.id === item.id);
};

const openPlaylist = (playlist) => {
  currentPlaylist.value = playlist;
  currentView.value = "playlist";
  isPlaylistLiked.value = false; // Would check from Firebase in a real app
};

const createPlaylist = () => {
  // In a real app, this would create a new playlist in Firebase
  const newPlaylist = {
    id: Date.now(),
    name: `My Playlist #${userPlaylists.value.length + 1}`,
    tracks: [],
  };

  userPlaylists.value.push(newPlaylist);
  openPlaylist(newPlaylist);
};

const toggleLikeSong = () => {
  isTrackLiked.value = !isTrackLiked.value;

  if (isTrackLiked.value && currentTrack.value) {
    // Add to liked songs if not already there
    if (!likedSongs.value.some((song) => song.id === currentTrack.value.id)) {
      likedSongs.value.push(currentTrack.value);
    }
  } else if (currentTrack.value) {
    // Remove from liked songs
    likedSongs.value = likedSongs.value.filter(
      (song) => song.id !== currentTrack.value.id
    );
  }
};

const toggleLikePlaylist = () => {
  isPlaylistLiked.value = !isPlaylistLiked.value;
  // In a real app, this would update in Firebase
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const goBack = () => {
  window.history.back();
};

const goForward = () => {
  window.history.forward();
};

// Lifecycle hooks
onMounted(() => {
  // For demo purposes, auto-login
  user.value = {
    uid: "user123",
    email: "demo@example.com",
    displayName: "Imad B.",
  };

  // Set up player timer simulation
  setInterval(() => {
    if (isPlaying.value && currentTrack.value) {
      currentTime.value += 1;
      if (currentTime.value >= duration.value) {
        currentTime.value = 0;
        isPlaying.value = false;
      }
    }
  }, 1000);

  // Handle window resize for responsive sidebar
  window.addEventListener("resize", () => {
    showSidebar.value = window.innerWidth >= 768;
  });
});
</script>

<style>
/* Additional styles could be added here if needed */
</style>
