package sdk

type SDK struct {
	Settings Settings
}

func New(s Settings) *SDK {
	return &SDK{
		Settings: s,
	}
}
