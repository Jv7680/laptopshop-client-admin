export function startLoading() {
    document.getElementsByTagName('body')[0].classList.add('prevent-scroll-body');
    document.getElementsByClassName('sweet-loading')[0].classList.add('sweet-loading--show');
    loadingCount.startLoadingCount++;
    console.log('startLoadingCount obj:', loadingCount.startLoadingCount);
}

export function stopLoading() {
    loadingCount.stopLoadingCount++;
    console.log('stopLoadingCount obj:', loadingCount.stopLoadingCount);

    if (loadingCount.startLoadingCount === loadingCount.stopLoadingCount) {
        document.getElementsByTagName('body')[0].classList.remove('prevent-scroll-body');
        document.getElementsByClassName('sweet-loading')[0].classList.remove('sweet-loading--show');
        loadingCount.startLoadingCount = 0;
        loadingCount.stopLoadingCount = 0;
    }
}

// đếm số lần start và stop loading
// vì componentDidMount là asynchronus nên chúng sẽ chạy gần như đồng thời và hàm start/stopLoading không còn thực thi
// đúng thứ tự
// vì vậy cần đếm số lượng start và stop, nếu bằng nhau thì mới stop thực sự
export let loadingCount = {
    startLoadingCount: 0,
    stopLoadingCount: 0,
}