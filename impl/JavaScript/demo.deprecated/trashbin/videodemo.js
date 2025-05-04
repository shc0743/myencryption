import { MP4Clip } from '@webav/av-cliper';

// 获取DOM元素
const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const timeDisplay = document.getElementById('timeDisplay');

// 全局变量
let clip;
let mp4Dur = 0;
let isPlaying = false;
let audioCtx;
let audioSource;
let timer;

// 视频URL - 替换为你的视频路径
// const videoUrl = 'path/to/your/video.mp4';

async function getfile() {
    // 使用 showOpenFilePicker API 选择文件
    const [fileHandle] = await window.showOpenFilePicker({
        types: [{
            description: 'MP4 Files',
            accept: {
                'video/mp4': ['.mp4'],
            },
        }],
    });
    // 返回
    return (await fileHandle.getFile());
}

let file;

// 创建自定义的ReadableStream
async function createVideoStream() {
    let currentPosition = 0;
    let controller;
    let isCancelled = false;
    let isFetching = false;
    const chunkSize = 512 * 1024; // 512KB的块大小

    return (await fetch(prompt("url?"))).body

    return new ReadableStream({
        start(ctrl) {
            controller = ctrl;
        },

        async pull(ctrl) {
            if (isCancelled || isFetching) return;

            isFetching = true;
            const end = currentPosition + chunkSize - 1;

            try {
                const value = file.slice(currentPosition, end);

                ctrl.enqueue(new Uint8Array(value));
                currentPosition += value.length;

            } catch (error) {
                console.error('获取视频数据失败:', error);
                if (!isCancelled) ctrl.error(error);
            } finally {
                isFetching = false;
            }
        },

        cancel() {
            // 流被取消时调用
            isCancelled = true;
        }
    });
}

// 初始化播放器
async function initPlayer() {
    try {
        // file = await getfile();
        const stream = await createVideoStream();

        clip = new MP4Clip(stream);
        const { duration, width, height } = await clip.ready;
        mp4Dur = Math.round(duration / 1e6); // 转换为毫秒

        // 设置进度条最大值
        progress.max = mp4Dur;
        updateTimeDisplay(0, mp4Dur);

        // 初始化音频上下文
        audioCtx = new AudioContext();

        console.log('播放器初始化完成');
        initBtn.remove();
    } catch (error) {
        console.error('初始化失败:', error);
    }
}

// 播放/暂停控制
function togglePlay() {
    if (!clip) return;

    if (isPlaying) {
        stopPlayback();
        playBtn.textContent = '播放';
    } else {
        startPlayback(progress.value * 1e6); // 转换为微秒
        playBtn.textContent = '暂停';
    }
    isPlaying = !isPlaying;
}

// 开始播放
function startPlayback(startTime) {
    stopPlayback(); // 确保先停止任何正在进行的播放

    let currentTime = startTime;
    let audioStartAt = 0;
    let isFirstFrame = true;

    timer = setInterval(async () => {
        const { state, video, audio } = await clip.tick(Math.round(currentTime));
        currentTime += (1000 / 30) * 1000; // 假设30fps

        // 更新UI
        const currentSec = currentTime / 1e6;
        progress.value = currentSec;
        updateTimeDisplay(currentSec, mp4Dur);

        // 处理视频结束
        if (state === 'done') {
            stopPlayback();
            playBtn.textContent = '播放';
            isPlaying = false;
            return;
        }

        // 渲染视频帧
        if (video != null && state === 'success') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            video.close();
        }

        // 跳过第一帧的音频（防止seek时的音频问题）
        if (isFirstFrame) {
            isFirstFrame = false;
            return;
        }

        // 处理音频
        const audioLength = audio[0]?.length ?? 0;
        if (audioLength === 0) return;

        const audioBuffer = audioCtx.createBuffer(2, audioLength, 48000);
        audioBuffer.copyToChannel(audio[0], 0);
        audioBuffer.copyToChannel(audio[1], 1);

        audioSource = audioCtx.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioCtx.destination);

        audioStartAt = Math.max(audioCtx.currentTime, audioStartAt);
        audioSource.start(audioStartAt);

        audioStartAt += audioBuffer.duration;
    }, 1000 / 30); // 30fps
}

// 停止播放
function stopPlayback() {
    if (audioSource) {
        audioSource.stop();
        audioSource = null;
    }
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// 更新时间显示
function updateTimeDisplay(current, duration) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
}

// 预览特定时间点
async function preview(timeSec) {
    stopPlayback();
    isPlaying = false;
    playBtn.textContent = '播放';

    const timeMicro = timeSec * 1e6;
    const { video } = await clip.tick(timeMicro);

    if (video) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.close();
    }
}

// 事件监听
playBtn.addEventListener('click', togglePlay);

progress.addEventListener('input', (e) => {
    preview(e.target.value);
});

// 初始化播放器
initBtn.onclick = () => initPlayer();