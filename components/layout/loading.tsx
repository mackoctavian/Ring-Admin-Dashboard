import Image from 'next/image'

function LoadingWidget() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
        <div className="relative size-8">
          <Image src="icons/icons/loading.svg" fill className="mr-2 h-6 w-6 animate-spin" alt="Loading..." />
        </div> &nbsp; loading ...
      </div>
    </div>
  );
}

export default LoadingWidget;
