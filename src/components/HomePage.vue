<template>
  <h3 class="mb-3">venipa-archive</h3>
  <div class="card file-card shadow border-0 rounded">
    <div class="card-body px-0">
      <div class="container-fluid">
        <div class="form-field">
          <input type="search" class="form-control" placeholder="Search..." v-model="searchInput" />
        </div>
      </div>
      <div class="file-list-wrapper mt-3">
        <ul class="list-group border-0 file-list">
          <a
            class="list-group-item list-group-item-action border-0"
            v-for="file in filteredFiles"
            :key="file.path"
            :href="file.url"
          >
            <div class="d-flex flex-column">
              <div>{{ file.name }}</div>
              <small class="text-muted">{{ file.path }}</small>
            </div>
          </a>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.file-card {
  &,
  & > .card-body {
    display: flex;
    flex: 1 1;
    flex-direction: column;
  }
}
.file-list-wrapper {
  flex: 1 1;
  position: relative;
  .file-list {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1 1;
    overflow: auto;
  }
}
</style>
<script lang="ts">
interface FileInfo {
  path: string;
  name: string;
  url: string;
}
export default {
  name: "HomePage",
  data(): {
    files: FileInfo[];
  } {
    return {
      files: [],
      searchQuery: "",
    };
  },
  computed: {
    searchInput: {
      get() {
        return this.searchQuery;
      },
      set(val) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.searchQuery = val;
        }, 300);
      },
    },
    filteredFiles: {
      get() {
        return this.files.filter((file: FileInfo) => {
          return file.path
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });
      },
    },
  },
  setup() {
    return {
      baseUrl: "https://s3.eu-central-1.wasabisys.com/venipa-archive/",
      updateLastFetch() {
        localStorage.lastFetch = new Date().toISOString();
        localStorage.lastFetchData = JSON.stringify(this.files);
      },
      fetchData() {
        return this.$http.get(this.baseUrl).then(({ data }) => {
          const files = new DOMParser().parseFromString(
            data,
            "application/xml"
          );
          return Array.from(files.querySelectorAll("Contents"))
            .map((root) => {
              const path: string = root.querySelector("Key").textContent;
              return <FileInfo>{
                path,
                name: path.slice(path.lastIndexOf("/") + 1),
                url: new URL(path, this.baseUrl).toString(),
              };
            })
            .filter((x) => x.name);
        });
      },
    };
  },
  mounted() {
    return new Promise((resolve, reject) => {
      if (localStorage.lastFetchData && localStorage.lastFetch) {
        const lastDate = Date.parse(localStorage.lastFetch);
        if (Date.now() - lastDate > 1000 * 60 * 60) {
          return this.fetchData().then(resolve);
        } else {
          return resolve(JSON.parse(localStorage.lastFetchData));
        }
      } else {
        return this.fetchData().then(resolve);
      }
    }).then((files) => {
      this.files = files;
      this.updateLastFetch();
    });
  },
};
</script>
