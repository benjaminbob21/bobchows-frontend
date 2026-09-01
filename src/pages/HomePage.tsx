import landingImage from "../assets/landing.png";
import appDownloadImage from "../assets/appDownload.png";

const HomePage = () => {
  return(
    <div className="flex flex-col gap-12">
        <div className="bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
            <h1 className="text-5xl font-bold tracking-tight text-purple-600">
                Order, Relax, Enjoy
            </h1>
            <span className="text-xl">Deliciousness is one click away!</span>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
            <img src={landingImage} />
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <span className="font-bold ttext-3xl tracking-tighter">
                    Order takeaway in a flash!
                </span>
                <span>
                    Download the BobChows App for an even faster ordering and personalised recommendations
                </span>
                <img src={appDownloadImage} />
            </div>
        </div>
    </div>
  )
}

export default HomePage;