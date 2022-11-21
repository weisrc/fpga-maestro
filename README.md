# FPGA Maestro

The website is located at https://weisrc.github.io/fpga-maestro/.

This repository serves as a tool to help generate content for a project in Integrated Logic Circuit (Verilog + AMD Vivado Suite). 

It also serves as an example of using https://github.com/weisrc/swrf without JSX with Vite. Functions heavily tested: `ref, fx, h`.

## How to use

1. Input a MIDI (.mid) file.
2. Align the vertical black lines to the notes and rests using Ticks Per Unit input field.
3. Copy column (channel) by clicking. The columns are further down below on the page.
3. Paste the column into a memory file in Vivado.
4. Use `readmemb` Verilog macro to read and load the file into a 2D register vector. `reg [5:0] data [0, <length of column - 1>]`

## Parameters

- Tick Offset, which tick to start.
- Note Silence, silence in tick into the end of the note.
- Ticks Per Unit, ticks per row in column.
- Ticks Per Pixel, preview canvas scaling.

## Disclaimer

This is a basic conversion software so it will not handle complicated MIDI files. Please use MIDI files that are derived from actual music sheets intended to be played on a piano by a person. The use of software generated MIDI files intenteded to be played by machines or a large group of people will result in suboptimal results.

## Column Format

Simple-to-implement, not-so-efficient-format.

```sv
wire [1:0] octave; // 0:3, 1:4, 2:5, 3:6
wire [3:0] note; // 0:rest, 1:C, 2:C#, 3:D ... 12:B
wire [5:0] row = {octave, note};
```

## License

MIT. Wei (weisrc)