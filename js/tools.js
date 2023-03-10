FpsCounter = function ()
{
    this.count = 0;
    this.fps = 0;
    this.prevSecond;
    this.minuteBuffer = new OverrideRingBuffer(60);
};

FpsCounter.prototype.update = function ()
{
    if ( !this.prevSecond )
    {
        this.prevSecond = new Date().getTime();
        this.count = 1;
    }
    else
    {
        const currentTime = new Date().getTime();
        const difference = currentTime - this.prevSecond;

        if ( difference > 1000 )
        {
            this.prevSecond = currentTime;
            this.fps = this.count;
            this.minuteBuffer.push(this.count);
            this.count = 0;
        }
        else
        {
            this.count++;
        }
    }
};

FpsCounter.prototype.getCountPerMinute = function ()
{
    return this.minuteBuffer.getAverage();
};

FpsCounter.prototype.getCountPerSecond = function ()
{
    return this.fps;
};

OverrideRingBuffer = function (size)
{
    this.size = size;
    this.head = 0;
    this.buffer = [];
};

OverrideRingBuffer.prototype.push = function (value)
{
    if ( this.head >= this.size )
    {
        this.head -= this.size;
    }

    this.buffer[this.head] = value;
    this.head++;
};

OverrideRingBuffer.prototype.getAverage = function ()
{
    if ( this.buffer.length === 0 )
    {
        return 0;
    }

    let sum = 0;

    for ( let i = 0; i < this.buffer.length; i++ )
    {
        sum += this.buffer[i];
    }

    return (sum / this.buffer.length).toFixed(1);
};

let scaleImageData = function (originalImageData, targetWidth, targetHeight)
{
    const targetImageData = new ImageData(targetWidth, targetHeight);
    const h1 = originalImageData.height;
    const w1 = originalImageData.width;
    const h2 = targetImageData.height;
    const w2 = targetImageData.width;
    const kh = h1 / h2;
    const kw = w1 / w2;
    const cur_img1pixel_sum = new Int32Array(4);
    for (let i2 = 0; i2 < h2; i2 += 1) {
        for (let j2 = 0; j2 < w2; j2 += 1) {
            for (let i in cur_img1pixel_sum) cur_img1pixel_sum[i] = 0;
            let cur_img1pixel_n = 0;
            for (let i1 = Math.ceil(i2 * kh); i1 < (i2 + 1) * kh; i1 += 1) {
                for (let j1 = Math.ceil(j2 * kw); j1 < (j2 + 1) * kw; j1 += 1) {
                    const cur_p1 = (i1 * w1 + j1) * 4;
                    for (let k = 0; k < 4; k += 1) {
                        cur_img1pixel_sum[k] += originalImageData.data[cur_p1 + k];
                    }
                    cur_img1pixel_n += 1;
                }
            }
            const cur_p2 = (i2 * w2 + j2) * 4;
            for (let k = 0; k < 4; k += 1) {
                targetImageData.data[cur_p2 + k] = cur_img1pixel_sum[k] / cur_img1pixel_n;
            }
        }
    }
    return targetImageData;
};

let rand = function (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}
