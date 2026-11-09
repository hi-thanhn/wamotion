import pytest

from wamotion_ears.argv import ArgvError, resolve, safe_name

OUT = "/jobs/x/out"
UP = {"film": "/data/in/abc/film.mp4", "ref": "/data/in/def/ref.wav"}


def test_uploads_and_outputs_are_substituted():
    argv, outs = resolve(["@film", "-o", "@out:sheet.png", "--from", "2", "--json"], UP, OUT)
    assert argv == ["/data/in/abc/film.mp4", "-o", f"{OUT}/sheet.png", "--from", "2", "--json"]
    assert outs == {"sheet.png": f"{OUT}/sheet.png"}


def test_queries_numbers_and_flags_pass_through():
    argv, _ = resolve(["@ref", "a glass ting", "--alts", "a door slam", "--start", "1.5", "--cues", "1.5,3.2"], UP, OUT)
    assert argv[1] == "a glass ting" and argv[-1] == "1.5,3.2"


@pytest.mark.parametrize("token", ["/etc/passwd", "~/x.wav", "../x.wav", "a/b.wav", "C:\\x.wav", "--profile=/p.json"])
def test_paths_are_refused(token):
    with pytest.raises(ArgvError):
        resolve(["@film", token], UP, OUT)


def test_unknown_upload_field_is_an_error_naming_the_fields_sent():
    with pytest.raises(ArgvError, match="fields sent: film, ref"):
        resolve(["@nope"], UP, OUT)


@pytest.mark.parametrize("args", [["-o", "sheet.png"], ["--out", "r.json"], ["--out=r.json"], ["-osheet.png"]])
def test_output_must_be_an_out_ref(args):
    with pytest.raises(ArgvError):
        resolve(["@film", *args], UP, OUT)


def test_out_name_is_a_bare_file_name():
    _, outs = resolve(["-o", "@out:../../etc/evil.png"], UP, OUT)
    assert list(outs) == ["evil.png"]
    assert safe_name(".hidden") == "hidden" and safe_name("") == "file" and safe_name("a b/c?.wav") == "c_.wav"


def test_args_must_be_strings():
    with pytest.raises(ArgvError):
        resolve(["@film", 3], UP, OUT)  # type: ignore[list-item]
