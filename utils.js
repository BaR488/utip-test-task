/*
    Класс для компрессии и декомпрессии массива цветовых данных
    Суть:
        * Убираем значения альфа-канала (так как прозрачность не используется);
        * Производим сжатие как разряженой структуры;
 */
class ArrayCompressor {
    static async compress(array) {
        let withoutAlpha = array.filter((x, i) => (i + 1) % 4 !== 0);
        let compressed = Array.from(withoutAlpha.slice(0, 3));
        compressed.push(1);

        for (let i = 3; i < withoutAlpha.length; i += 3) {
            if (withoutAlpha[i] === compressed[compressed.length - 4]
                && withoutAlpha[i + 1] === compressed[compressed.length - 3]
                && withoutAlpha[i + 2] === compressed[compressed.length - 2]) {
                compressed[compressed.length - 1]++;
            } else {
                compressed.push(...withoutAlpha.slice(i, i + 3), 1);
            }
        }

        return compressed.toString();
    }

    static async decopmress(data) {
        let decompressArray = [];
        let dataArray = data.split(",").map(x => parseInt(x));

        for (let i = 0; i < dataArray.length; i += 4) {
            let color = dataArray.slice(i, i + 3);
            let colorSumm = color.reduce((summ, item) => summ + item);
            for (let j = 0; j < dataArray[i + 3]; j++) {
                decompressArray.push(...color, colorSumm ? 255 : 0);
            }
        }

        return decompressArray;
    }
}

export {ArrayCompressor}